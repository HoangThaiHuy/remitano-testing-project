import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAuth } from '@/configs/interface'

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService
  ) {
    const authConfig = configService.get<IAuth>('auth');
    super({
      clientID: authConfig.google.id,
      clientSecret: authConfig.google.secret,
      callbackURL: authConfig.google.redirectUrl,
      scope: ['email', 'profile']
    });
  }

  async validate(
    _accessToken: string, _refreshToken: string, profile: Profile
  ) {
    try {
      const user = {
        provider: 'google',
        providerId: profile.id,
        email: profile.emails[0].value,
        password: 'provided',
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        image: profile.photos[0].value,
        verified: profile.emails[0].verified
      }

      return user
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException()
    }
  }
}