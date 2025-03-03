import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewRegisterDto } from './dto/new-register-dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/find-for-login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'User suspended' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  register(@Body() newRegisterDto: NewRegisterDto) {
    return this.authService.register(newRegisterDto);
  }
}
