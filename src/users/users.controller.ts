import {
  All,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
} from '@nestjs/common';
import { Admin } from 'libs/decorator/admin_access.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { RequestWithUser } from 'libs/common/types/request-with-user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Admin()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @All()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @All()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() context: RequestWithUser,
  ) {
    return this.usersService.update(id, updateUserDto, context);
  }

  @Admin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
