import {

  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { Admin } from 'libs/decorator/admin_access.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { RequestWithUser } from 'libs/common/types/request-with-user';
import { PaginationDto } from 'src/libs/common/dto/pagination';
import { ALL } from 'libs/decorator/all_access.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Admin()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAllPaginated(paginationDto);
  }

  @ALL()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @ALL()
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
