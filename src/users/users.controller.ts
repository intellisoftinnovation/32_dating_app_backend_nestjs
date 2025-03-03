import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ItPrivileges } from 'src/auth/interfaces/ItPrivileges';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import {  UserDocument } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post() 
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Auth(ItPrivileges.ALL_PRIVILEGES)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('self')
  @Auth()
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User with provided id dont exist' })
  async getSelfUser(@GetUser('_id') idInToken:string ) {
    return await this.usersService.getSelfUser(idInToken);
  }

  @Auth()
  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User with provided id dont exist' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already in use' })
  @ApiResponse({ status: HttpStatus.PRECONDITION_FAILED, description: 'Phone already in use' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser() user: UserDocument) {
    if(id!=user._id.toString() && !user.metaData.privileges.includes(ItPrivileges.ALL_PRIVILEGES)) throw new HttpException({message:'You do not have permissions to edit other users', details: `You need one of the following privileges: ${ItPrivileges.ALL_PRIVILEGES}`}, HttpStatus.FORBIDDEN );

    return await this.usersService.updateUser(id, updateUserDto);
  }



}
