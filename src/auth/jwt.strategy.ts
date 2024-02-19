import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JWTPayload } from 'libs/common/types/jwt-payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'iamSecret'),
    });
  }

  async validate(payload: JWTPayload) {
    const { id, email, phone, firstName, lastName, role } = payload;
    const user = await this.usersService.findOne({
      id,
      email,
      phone,
      firstName,
      lastName,
      role,
    });

    if (!user) {
      throw new ForbiddenException('forbidden');
    }
    return payload;
  }
}
