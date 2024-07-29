import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, Otp } from '@/entities';
import { hashPassword, comparePassword, generateOTP, generateSecretKey } from '@/common/password';
import { hashSync, compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginResponseDto, PayloadDto, SignupDto, VerifyOtp } from './dto';

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));


describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let otpRepo: Repository<Otp>;
  let jwtService: JwtService;
  let mailerService: MailerService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        JwtService,
        MailerService,
        {
          provide: getRepositoryToken(Otp),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn()
          }
        }
      ],

    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    otpRepo = module.get<Repository<Otp>>(getRepositoryToken(Otp));
    jwtService = module.get<JwtService>(JwtService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user password successful', async () => {
    const repo = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValue(mockUserEntity);

    const compareMock = jest.mocked(compareSync);
    compareMock.mockResolvedValue(true as never);
    const result = await service.validate(mockUserEntity.email, 'password');
    expect(result).toEqual(expect.objectContaining({
      id: mockUserEntity.id,
      email: mockUserEntity.email,
      userName: mockUserEntity.userName,
    }));

    expect(repo).toHaveBeenCalledWith({
      where: {
        email: 'email'
      },
    });
  });

  it('should validate user password fail due to cannot found user', async () => {
    const repo = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValue(null);

    const compareMock = jest.mocked(compareSync);
    compareMock.mockResolvedValue(true as never);
    await expect(service.validate(mockUserEntity.email, 'password')).rejects.toThrow("user.error.LOGIN_FAIL");
    expect(repo).toHaveBeenCalledWith({
      where: {
        email: 'email'
      },
    });
  });

  it('should validate user password fail due to wrong password', async () => {
    const repo = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValue(mockUserEntity);

    const compareMock = jest.mocked(compareSync);
    compareMock.mockResolvedValue(false as never);
    await expect(service.validate(mockUserEntity.email, 'password')).rejects.toThrow("user.error.LOGIN_FAIL");
    expect(repo).toHaveBeenCalledWith({
      where: {
        email: 'email'
      },
    });
  });

  it('should generate token', async () => {
    jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken.access_token);
    const result = await service.generateToken(mockUserEntity);
    expect(result).toEqual(mockToken);
  });

  it('should signup successful', async () => {
    jest
      .spyOn(userRepo, 'create')
      .mockResolvedValue({} as never);
    jest
      .spyOn(userRepo, 'save')
      .mockResolvedValue(mockUserEntity);
    const repo = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValue(null);

    const result = await service.signup(mockSignup);
    expect(result).toEqual(expect.objectContaining({
      email: mockSignup.email,
    }));

    expect(repo).toHaveBeenCalledWith({
      where: {
        email: 'email'
      },
    });
  });

  it('should signup fail due to email exists', async () => {
    jest
      .spyOn(userRepo, 'create')
      .mockResolvedValue({} as never);
    jest
      .spyOn(userRepo, 'save')
      .mockResolvedValue(mockUserEntity);
    const repo = jest
      .spyOn(userRepo, 'findOne')
      .mockResolvedValue(mockUserEntity);

    await expect(service.signup(mockSignup)).rejects.toThrow("user.error.EMAIL_EXISTS");

    expect(repo).toHaveBeenCalledWith({
      where: {
        email: 'email'
      },
    });
  });

});


const mockUserEntity: User = {
  id: 'uuid',
  email: 'email',
  userName: 'userName',
  fullName: 'fName',
  status: 'status',
  password: 'password',
  createdAt: new Date(),
  updatedAt: new Date(),
  hashPassword() {
    return 'hashPassword';
  },
  toJSON() {
    return {
    }
  },
};

const mockToken: LoginResponseDto = {
  payload: {
    id: mockUserEntity.id,
    email: mockUserEntity.email,
    name: mockUserEntity.fullName
  },
  access_token: 'access_token',
  expires_in: 86400
}

const mockSignup: SignupDto = {
  email: 'email',
  password: 'password',
  confirmPassword: 'password',
}
