import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewRegisterDto } from './dto/new-register-dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/find-for-login.dto';
import { WantPassRecoveryDto } from './dto/want-pass-recovery.dto';
import { OtpPassRecoveryDto } from './dto/otp-pass-recovery.dto';
import { ConfirmPassRecoveryDto } from './dto/confir-pass-recovery.dto';
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @RateLimit(4, 60*1000)
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
  @RateLimit(3, 60*1000)
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  register(@Body() newRegisterDto: NewRegisterDto) {
    return this.authService.register(newRegisterDto);
  }

  @Post('wantpassrecovery')
  @RateLimit(2, 60*1000)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with email not found',
  })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    description: 'User with email dont have phone',
  })
  wantPassRecovery(@Body() wantpassrecoverydto: WantPassRecoveryDto) {
    return this.authService.wantPassRecovery(wantpassrecoverydto);
  }

  @Post('confirmpassrecovery')
  @RateLimit(2, 60*1000)
  @HttpCode(HttpStatus.OK)
  confirmPassRecovery(@Body() confirmPassRecoveryDto: ConfirmPassRecoveryDto) {
    return this.authService.confirmPassRecovery(confirmPassRecoveryDto);
  }

  @Post('otppassrecovery')
  @RateLimit(2, 60*1000)
  @HttpCode(HttpStatus.OK)
  otpPassRecovery(@Body() otpPassRecoveryDto: OtpPassRecoveryDto) {
    return this.authService.otpPassRecovery(otpPassRecoveryDto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @Auth()
  logout(@GetUser('id') id: string) {
    return this.authService.logout(id);
  }



}
