import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from 'libs/common/types/User';
import { RequestWithUser } from 'libs/common/types/request-with-user';
import { UsersService } from 'src/users/users.service';
import {
  CreateAdminDto,
  ResetPasswordDto,
  SignupDto,
  UpdatePasswordDto,
} from './dto/auth-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: Partial<SignupDto>) {
    const saltOrRound = parseInt(
      this.configService.get<'string'>('SALT_OR_ROUNDS') ?? '8',
    );

    const password = await bcrypt.hash(signupDto.password, saltOrRound);

    const data: SignupDto = {
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      email: signupDto.email,
      phone: signupDto.phone,
      password: password,
      role: signupDto.role,
      ...(signupDto.image ? { image: signupDto.image } : null),
    };

    return this.usersService.create(data);
  }

  async registerAdmin(signupDto: CreateAdminDto) {
    const saltOrRound = parseInt(
      this.configService.get<'string'>('SALT_OR_ROUNDS') ?? '8',
    );

    const password = await bcrypt.hash(
      signupDto.password ?? signupDto.phone,
      saltOrRound,
    );

    const data: CreateAdminDto = {
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      email: signupDto.email,
      phone: signupDto.phone,
      password,
      role: signupDto.role,
      requiredPasswordChange: true,
      ...(signupDto.image ? { image: signupDto.image } : null),
    };

    return this.usersService.create(data);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findOne({
      phone: resetPasswordDto.phone,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isValidPhone = false; // TO DO: do something with otp

    if (!isValidPhone) {
      throw new ForbiddenException('forbidden');
    }

    const saltOrRound = parseInt(
      this.configService.get<'string'>('SALT_OR_ROUNDS') ?? '8',
    );

    const password = await bcrypt.hash(
      resetPasswordDto.newPassword,
      saltOrRound,
    );

    return this.usersService.update(user.id, { password });
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    context: RequestWithUser,
  ) {
    const user = await this.usersService.findOne({ id: context?.user?.id });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isPassMatched = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isPassMatched) {
      throw new ForbiddenException('forbidden');
    }

    const saltOrRound = parseInt(
      this.configService.get<'string'>('SALT_OR_ROUNDS') ?? '8',
    );

    const password = await bcrypt.hash(
      updatePasswordDto.newPassword,
      saltOrRound,
    );

    return this.usersService.update(user.id, { password });
  }

  remove(id: string) {
    return this.usersService.remove(id);
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
