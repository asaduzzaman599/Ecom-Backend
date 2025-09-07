import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ALL } from 'libs/decorator/all_access.decorator';

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

  @ALL()
  @Get('me')
  async me(@Request() req) {
    return {
      user: req.user,
      access_token: req.headers.authorization.replace('Bearer ', ''),
    };
  }

  @Public()
  @Post('register-admin')
  registerAdmin(@Body() createAdminDto: SignupDto) {
    return this.authService.registerAdmin(createAdminDto);
  }

  @ALL()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ALL()
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
