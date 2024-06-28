import {
  BadRequestException,
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
  CreateAuthDto,
  ResetPasswordDto,
  SignupDto,
  UpdateAuthDto,
  UpdatePasswordDto,
} from './dto/auth-input.dto';
import { MasterService } from 'libs/master/master.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AdminAccess } from 'libs/common/constant/admin-access';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private customPrisma: MasterService,
  ) {}

  create(
    createAuthDto: CreateAuthDto,
    option?: { tx: Prisma.TransactionClient },
  ) {
    return (option?.tx ?? this.customPrisma).auth.create({
      data: createAuthDto,
    });
  }

  async update(
    id: string,
    updateAuthDto: UpdateAuthDto,
    context?: RequestWithUser,
  ) {
    const args = {
      id:
        context && !AdminAccess.includes(context.user.role) //admin or forget pass with otp only allow pass change with out context
          ? context.user.id
          : id,
    };

    const auth = await this.findOne(args);

    if (!auth) throw new ForbiddenException('forbidden');

    return this.customPrisma.auth.update({ where: args, data: updateAuthDto });
  }

  async findOne(
    args?: Prisma.AuthWhereUniqueInput,
    select?: Prisma.AuthSelect<DefaultArgs>,
  ) {
    const auth = await this.customPrisma.auth.findUnique({
      ...(args ? { where: args } : null),
      ...(select ? { select } : null),
    });

    return auth;
  }

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
      role: signupDto.role,
      password,
      ...(signupDto.image ? { image: signupDto.image } : null),
    };
    return this.register(data);
  }

  async registerAdmin(signupDto: SignupDto) {
    const saltOrRound = parseInt(
      this.configService.get<'string'>('SALT_OR_ROUNDS') ?? '8',
    );

    const password = await bcrypt.hash(
      signupDto.password ?? signupDto.phone,
      saltOrRound,
    );

    const data: SignupDto = {
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      email: signupDto.email,
      phone: signupDto.phone,
      password,
      role: signupDto.role,
      requiredPasswordChange: true,
      ...(signupDto.image ? { image: signupDto.image } : null),
    };

    return this.register(data);
  }

  async register(signupDto: SignupDto) {
    const { password, ...userData } = signupDto;
    return this.customPrisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await this.usersService.create(userData, { tx });
        if (!user) throw new BadRequestException('User create failed!');
        const authData: CreateAuthDto = {
          email: signupDto.email,
          phone: signupDto.phone,
          role: signupDto.role,
          userId: user.id,
          password,
        };

        const auth = await this.create(authData, { tx });
        if (!auth) throw new BadRequestException('User create failed!');

        return user;
      },
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const auth = await this.findOne({
      phone: resetPasswordDto.phone,
    });
    if (!auth) {
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

    return this.update(auth.id, { password });
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    context: RequestWithUser,
  ) {
    const auth = await this.findOne({ id: context?.user?.id });
    if (!auth) {
      throw new NotFoundException('user not found');
    }

    const isPassMatched = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      auth.password,
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

    return this.update(auth.id, { password }, context);
  }

  remove(id: string) {
    return this.usersService.remove(id);
  }

  async validateUser(args: {
    phone?: string;
    email?: string;
    pass: string;
  }): Promise<User> {
    const { pass, phone, email } = args;
    if (!phone && !email) return null;

    const credential = email ? { email } : { phone };
    const auth = await this.customPrisma.auth.findUnique({
      where: { ...credential },
    });
    if (!auth) return null;

    const isPassMatched = await bcrypt.compare(pass, auth.password);
    if (!isPassMatched) return null;

    return this.usersService.findOne({ id: auth.userId });
  }
}
