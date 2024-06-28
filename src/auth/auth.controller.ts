import {
  All,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Admin } from 'libs/decorator/admin_access.decorator';
import { Public } from 'libs/decorator/public_access.decorator';
import { AuthService } from './auth.service';
import {
  ResetPasswordDto,
  SignupDto,
  UpdatePasswordDto,
} from './dto/auth-input.dto';
import { RequestWithUser } from 'libs/common/types/request-with-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @Admin()
  @Post('register-admin')
  registerAdmin(@Body() createAdminDto: SignupDto) {
    return this.authService.registerAdmin(createAdminDto);
  }

  @All()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @All()
  @Patch()
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() context: RequestWithUser,
  ) {
    return this.authService.updatePassword(updatePasswordDto, context);
  }

  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
