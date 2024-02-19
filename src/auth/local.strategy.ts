import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'libs/common/types/User';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { JWTPayload } from 'libs/common/types/jwt-payload';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    super({ usernameField: 'phone', passwordField: 'password' });
  }

  async validate(
    username: string,
    password: string,
  ): Promise<{ user: User; access_token: string }> {
    const user = await this.authService.validateUser({
      phone: username,
      pass: password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    return { user, access_token: this.jwtService.sign(payload) };
  }
}
