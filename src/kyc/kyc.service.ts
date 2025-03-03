import { forwardRef,  HttpException,  HttpStatus,  Inject, Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { facePlusGenderVerify, FacePlusVerifyCode } from './helpers/face-plus-gender-verify';
import { generateOTP, verifyOTP } from '../helpers/speakeasy-otp';
import { sendSMS } from 'src/helpers/send-sms';
import { envs } from 'src/config';


@Injectable()
export class KycService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
        @Inject(forwardRef(() => FilesService)) private readonly filesService: FilesService,
    ) { }

    async genderVerify(file: Express.Multer.File, user: UserDocument) {
        const tempUser = await this.usersService.getSelfUser(user._id.toString())
        const gender = tempUser.profile.gender
        const tempFile = await this.filesService.create(file, user)

        const { code, details, verified } = await facePlusGenderVerify(gender, tempFile.secure_url)

        switch (code) {
            case FacePlusVerifyCode.SUCCESS:
                await this.usersService.verifyGender(user._id.toString())
                return { message: 'Gender verified', code, verified };
            case FacePlusVerifyCode.NO_FACE:
                return { message: 'No face', code, verified };
            case FacePlusVerifyCode.MULTIPLE_FACES:
                return { message: 'Multiple faces', code ,verified };
            case FacePlusVerifyCode.GENDER_MISMATCH:
                return { message: 'Gender mismatch', code, verified };
            case FacePlusVerifyCode.TRY_AGAIN_LATER:
                console.log({code, details })
                return { message: 'Try again later', code, details, verified };
        }
    }

    async phoneVerifyRequest(user: UserDocument) {
        const tempUser = await this.usersService.getSelfUser(user._id.toString())
        const phone = tempUser.profile.phone
        
        if (!phone) {
            throw new HttpException({ message: 'Phone not found' }, HttpStatus.PRECONDITION_FAILED);
        }

        const totp = generateOTP({ phone })

        const {send_status} = await sendSMS(phone, ` ${totp} es su código de verificación de Chamoy`)

        if(envs.ERRORLOGS) console.log(send_status)

        return {message: "Código enviado"}
    }

    async phoneVerify(user: UserDocument, code: string) {
        const tempUser = await this.usersService.getSelfUser(user._id.toString())
        const phone = tempUser.profile.phone

        if (!phone) {
            throw new HttpException({ message: 'Phone not found' }, HttpStatus.PRECONDITION_FAILED);
        }

        const isValid = verifyOTP({ phone }, code)

        if (!isValid) {
            return { message: 'Invalid code', verified: false  };
        }

        await this.usersService.verifyPhone(user._id.toString())

        return { message: 'Phone verified', verified: true};
    }
}
