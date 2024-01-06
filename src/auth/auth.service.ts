import { Injectable } from '@nestjs/common';
import { SignupDto, LoginDto, UpdatePasswordDto } from './dto/auth-input.dto';

@Injectable()
export class AuthService {
  signup(signupDto: SignupDto) {
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

  remove() {
    return 'This action remove a new auth';
  }
}
