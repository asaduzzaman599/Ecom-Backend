import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from 'libs/common/types/User';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    super({ usernameField: 'phone' });
  }

  async validate(input: {
    phone: string;
    pass: string;
  }): Promise<{ user: User; access_token: string }> {
    const user = await this.authService.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return { user, access_token: this.jwtService.sign(payload) };
  }
}
