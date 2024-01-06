import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, UpdatePasswordDto } from './dto/auth-input.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Patch()
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove();
  }
}
