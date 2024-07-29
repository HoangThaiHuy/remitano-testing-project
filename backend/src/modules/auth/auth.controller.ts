import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto, LoginResponseDto, LoginDto } from './dto';
import { ApiBaseResponse } from '@/common/response/dto';
import { Recaptcha } from '@nestlab/google-recaptcha';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiBaseResponse(Boolean)
  @Post('signup')
  async signup(
    @Body()
    data: SignupDto,
  ) {
    return this.authService.signup(data);
  }

  @ApiBaseResponse(LoginResponseDto)
  @Post('login')
  async login(
    @Body()
    data: LoginDto,
  ) {
    const user = await this.authService.validate(
      data.email,
      data.password,
    );
    return await this.authService.generateToken(user);
  }

  @ApiBaseResponse(LoginResponseDto)
  @Post('register-or-login')
  async registerOrLogin(
    @Body()
    data: LoginDto,
  ) {
    let user = await this.authService.findByAttr('email', data.email);
    if (!user) {
      user = await this.authService.signup({
        email: data.email,
        password: data.password,
        confirmPassword: data.email
      });

    }
    return await this.authService.generateToken(user);
  }
}
