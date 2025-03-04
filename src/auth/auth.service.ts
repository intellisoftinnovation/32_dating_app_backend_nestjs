import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NewRegisterDto } from './dto/new-register-dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/find-for-login.dto';
import { WantPassRecoveryDto } from './dto/want-pass-recovery.dto';
import { generateOTP, verifyOTP } from 'src/helpers/speakeasy-otp';
import { sendSMS } from 'src/helpers/send-sms';
import { envs } from 'src/config';
import { EncryptionService } from 'src/tools/AES';
import { OtpPassRecoveryDto } from './dto/otp-pass-recovery.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfirmPassRecoveryDto } from './dto/confir-pass-recovery.dto';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    register(newRegisterDto: NewRegisterDto) {
        return this.usersService.createUser(newRegisterDto);
    }

    login(loginDto: LoginDto) {
        return this.usersService.findForLogin(loginDto);
    }

    async wantPassRecovery(wantPassRecoveryDto: WantPassRecoveryDto) {
        const { email } = wantPassRecoveryDto
        const user = await this.usersService.findForPassRecovery(email)
        if (!user.profile.phone) throw new HttpException({ message: 'Phone not found' }, HttpStatus.PRECONDITION_FAILED);



        const path = EncryptionService.encrypt(user._id.toString());

        if (envs.ERRORLOGS) console.log(path, user._id.toString(), EncryptionService.decrypt(path))
        return { message: "Account found", phone: user.profile.phone, path }
    }

    async confirmPassRecovery(confirmPassRecovery: ConfirmPassRecoveryDto) {
        const { path } = confirmPassRecovery

        const user_id = EncryptionService.decrypt(path);
        const user = await this.usersService.getUserById(user_id);

        const totp = generateOTP({ phone: user.profile.phone, password: user.password })

        const { send_status } = await sendSMS(user.profile.phone, ` ${totp} es su código de verificación de Chamoy`)

        if (envs.ERRORLOGS) console.log(send_status)

        return { message: "Código enviado"}
    }

    async otpPassRecovery(otpPassRecoveryDto: OtpPassRecoveryDto) {
        const { otp, path } = otpPassRecoveryDto;
        const user_id = EncryptionService.decrypt(path);
        const user = await this.usersService.getUserById(user_id);
        const isValid = verifyOTP({ phone: user.profile.phone, password: user.password }, otp)

        if (!isValid) throw new HttpException({ message: 'Código inválido' }, HttpStatus.FORBIDDEN)

        const token = await this.jwtService.signAsync({ id: user._id });
        return { message: `Código válido`, token: token, id: user._id };
    }
}
