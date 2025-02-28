import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewRegisterDto } from './dto/new-register-dto';
import { ApiResponse } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login() {
      
  }

  @Post('register')
  @ApiResponse({status: HttpStatus.CREATED})
  @ApiResponse({status: HttpStatus.BAD_REQUEST})
  @ApiResponse({status: HttpStatus.CONFLICT, description: 'Email already exists'})
  register(@Body() newRegisterDto: NewRegisterDto) {
    return this.authService.register(newRegisterDto);
  }
}
