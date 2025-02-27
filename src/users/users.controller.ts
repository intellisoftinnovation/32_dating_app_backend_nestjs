import { Body, Controller, Get, HttpStatus, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  // @Post() 
  @ApiResponse({status: HttpStatus.CREATED})
  @ApiResponse({status: HttpStatus.BAD_REQUEST})
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('self/:id')
  @ApiResponse({status: HttpStatus.OK})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Invalid id'})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'User with provided id dont exist'})
  async getSelfUser(@Param('id') id: string) {
    return await this.usersService.getSelfUser(id);
  }

  @Patch(':id')
  @ApiResponse({status: HttpStatus.OK})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Invalid id'})
  @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'User with provided id dont exist'})
  @ApiResponse({status: HttpStatus.CONFLICT , description: 'Email already in use'})
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(id, updateUserDto);
  }
  


}
