import {
  Injectable, NotFoundException, ConflictException, ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { User, Otp } from '@/entities';
import { hashPassword, comparePassword, generateOTP, generateSecretKey } from '@/common/password';
import { ConfigService } from '@nestjs/config';
import { IAuth, IApp } from '@/configs/interface';
import { LoginResponseDto, PayloadDto, SignupDto, VerifyOtp } from './dto';
import { OtpType, UserStatus } from '@/entities/value-object';



@Injectable()
export class AuthService {
  private authConfig: IAuth;
  private appConfig: IApp;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {
    this.authConfig = configService.get<IAuth>('auth');
    this.appConfig = configService.get<IApp>('app');
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user && (await comparePassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new NotFoundException({
      message: 'user.error.LOGIN_FAIL',
    });
  }

  async generateToken(user: User): Promise<LoginResponseDto> {
    const payload: PayloadDto = {
      name: user.fullName,
      email: user.email,
      id: user.id,
    };

    const expiresIn = this.authConfig?.jwtExpiresIn || 86400;

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn,
      }),
      payload,
      expires_in: expiresIn,
    };
  }

  public async resendOtp(email: string, type: OtpType) {
    let user = await this.findByAttr('email', email);
    if (!user) {
      throw new NotFoundException({
        message: 'user.error.NOT_FOUND',
      });
    }

    await this.otpRepository
      .createQueryBuilder()
      .update(Otp)
      .set({
        used: true
      })
      .where("user_id = :user_id", { user_id: user.id })
      .andWhere("type = :type", { type: type })
      .execute()


    const code = generateOTP();
    const key = generateSecretKey();
    const expireAt = Math.floor(Date.now() / 1000) + this.appConfig.emailExpireAt;

    const otp = this.otpRepository.create();

    otp.code = code;
    otp.type = type;
    otp.userId = user.id;
    otp.expireAt = expireAt;
    otp.secretKey = key;
    await this.otpRepository.save(otp);

    await this._sendEmail(user.email, type, {
      email: user.email,
      code: code
    })

    return {
      otp_key: key
    };
  }

  public async signup(payload: SignupDto): Promise<any> {
    let existingUser = await this.findByAttr('email', payload.email);

    if (existingUser) {
      throw new ConflictException({
        message: 'user.error.EMAIL_EXISTS',
      });
    } else {
      const user = this.userRepository.create();
      user.email = payload.email;
      user.userName = payload.email.replace(/@.*/, "");
      user.fullName = user.userName;
      user.password = payload.password;
      return await this.userRepository.save(user);
    }
  }

  public async verifyOTP(data: VerifyOtp) {
    const otp: Otp = await this.otpRepository.findOne({
      where: {
        secretKey: data.otp_key,

      }
    })

    if (!otp || otp.used) {
      throw new ForbiddenException({
        message: 'user.error.OTP_INVALID',
      });

    }

    const expireAt = Math.floor(Date.now() / 1000);

    if (otp.expireAt < expireAt) {
      throw new ForbiddenException({
        message: 'user.error.OTP_EXPIRED',
      });
    }

    if (otp.code != data.otp) {
      throw new ForbiddenException({
        message: 'user.error.OTP_INVALID',
      });
    }

    await this.otpRepository
      .createQueryBuilder()
      .update(Otp)
      .set({
        used: true
      })
      .where("id = :id", { id: otp.id })
      .execute()

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        status: UserStatus.ACTIVATED
      })
      .where("id = :id", { id: otp.userId })
      .execute()


    return true;
  }

  async findByAttr(attr: string, value: any) {
    return await this.userRepository.findOne({
      where: {
        [attr]: value,
      },
    });
  }

  private async _sendEmail(email: string, type: OtpType, data: any) {
    switch (type) {
      case OtpType.REGISTER: {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Confirm your email',
          template: 'register',
          context: data
        })
        break;
      }
      case OtpType.FORGOT_PASSWORD: {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Forgot Password',
          template: 'forgot-password',
          context: data
        })
        break;
      }
    }
  }
}
