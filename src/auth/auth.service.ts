import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto, SignupDto, UpdatePasswordDto } from './dto/auth-input.dto';
import { User } from 'libs/common/types/User';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  signup(signupDto: Partial<SignupDto>) {
    return 'This action adds a new auth';
  }

  login(loginDto: LoginDto) {
    return 'This action adds a new auth';
  }

  /* resetPassword(signupDto: SignupDto) {
    return 'This action adds a new auth';
  } */

  updatePassword(updatePasswordDto: UpdatePasswordDto) {
    return 'This action adds a new auth';
  }

  remove(id: string) {
    return 'This action remove a new auth';
  }

  async validateUser(args: { phone: string; pass: string }): Promise<User> {
    const { pass, phone } = args;
    const user = await this.usersService.findOne({ phone });
    if (!user) return null;

    const isPassMatched = await bcrypt.compare(pass, user.password);
    if (!isPassMatched) return null;

    const { password, ...result } = user;
    return result;
  }
}
