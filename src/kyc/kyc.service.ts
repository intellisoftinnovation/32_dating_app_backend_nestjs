import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { facePlusGenderVerify, FacePlusVerifyCode } from './helpers/face-plus-gender-verify';
import { generateOTP, verifyOTP } from '../helpers/speakeasy-otp';
import { sendSMS } from 'src/helpers/send-sms';
import { envs } from 'src/config';
import { PictureVerifyDto, VerifyDeep } from './dto/picture-verify.dto';
import { facePlusPictureVerifyBeta, FacePlusPictureVerifyCode, facePlusPictureVerifyPro } from './helpers/face-plus-picture-verify';


@Injectable()
export class KycService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
        @Inject(forwardRef(() => FilesService)) private readonly filesService: FilesService,
    ) { }

    async genderVerify(file: Express.Multer.File, user: UserDocument) {
        const tempUser = await this.usersService.getSelfUser(user._id.toString())
        const gender = tempUser.profile.gender
        if (!gender) {
            throw new HttpException({ message: 'You have not selected a gender yet' }, HttpStatus.PRECONDITION_FAILED);
        }
        const tempFile = await this.filesService.create(file, user)

        const { code, details, verified } = await facePlusGenderVerify(gender, tempFile.secure_url)

        switch (code) {
            case FacePlusVerifyCode.SUCCESS:
                await this.usersService.verifyGender(user._id.toString())
                return { message: 'Gender verified', code, verified };
            case FacePlusVerifyCode.NO_FACE:
                return { message: 'No face', code, verified };
            case FacePlusVerifyCode.MULTIPLE_FACES:
                return { message: 'Multiple faces', code, verified };
            case FacePlusVerifyCode.GENDER_MISMATCH:
                return { message: 'Gender mismatch', code, verified };
            case FacePlusVerifyCode.TRY_AGAIN_LATER:
                console.log({ code, details })
                return { message: 'Try again later', code, details, verified };
        }
    }

    async pictureVerify(file: Express.Multer.File, pictureVerifyDto: PictureVerifyDto) {
        const { x, y, rectangle_width, rectangle_height, deep } = pictureVerifyDto;
        let code = null, details = null, valid = false;

        if (deep === VerifyDeep.BETA) {
            // Desestructuración correcta al recibir el resultado de facePlusPictureVerifyBeta
            ({ code, details, valid } = await facePlusPictureVerifyBeta(`${x},${y},${rectangle_width},${rectangle_height}`, file));
        } else {
            // Desestructuración correcta al recibir el resultado de facePlusPictureVerifyPro
            ({ code, details, valid } = await facePlusPictureVerifyPro(`${x},${y},${rectangle_width},${rectangle_height}`, file));
        }

        if (!valid) {
            switch (code) {
                case FacePlusPictureVerifyCode.NO_FACE:
                    return { message: 'No face detected', code, details };
                case FacePlusPictureVerifyCode.MULTIPLE_FACES:
                    return { message: 'Multiple faces detected', code, details };
                case FacePlusPictureVerifyCode.FACE_OUT:
                    return { message: 'Face is out of the area', code, details };
                case FacePlusPictureVerifyCode.TRY_AGAIN_LATER:
                    console.log({ code, details });
                    return { message: 'Try again later', code, details };
                case FacePlusPictureVerifyCode.FACE_NOT_IN_RECTANGLE:
                    return { message: 'Face is not in the rectangle', code, details };
                default:
                    return { message: 'Unknown error', code, details };
            }
        }

        // Si la respuesta es válida
        switch (code) {
            case FacePlusPictureVerifyCode.SUCCESS:
                return { message: 'Face verified successfully', code, details };
            default:
                return { message: 'Unknown result', code, details };
        }
    }

    async phoneVerifyRequest(user: UserDocument) {
        const tempUser = await this.usersService.getSelfUser(user._id.toString())
        const phone = tempUser.profile.phone

        if (!phone) {
            throw new HttpException({ message: 'Phone not found' }, HttpStatus.PRECONDITION_FAILED);
        }

        const totp = generateOTP({ phone })

        const { send_status } = await sendSMS(phone, ` ${totp} es su código de verificación de Chamoy`)

        if (envs.ERRORLOGS) console.log(send_status)

        return { message: "Código enviado" }
    }

    async phoneVerify(user: UserDocument, code: string) {
        const tempUser = await this.usersService.getSelfUser(user._id.toString())
        const phone = tempUser.profile.phone

        if (!phone) {
            throw new HttpException({ message: 'Phone not found' }, HttpStatus.PRECONDITION_FAILED);
        }

        const isValid = verifyOTP({ phone }, code)

        if (!isValid) {
            return { message: 'Invalid code', verified: false };
        }

        await this.usersService.verifyPhone(user._id.toString())

        return { message: 'Phone verified', verified: true };
    }

    async verifyWithPhone(phone: string) {
        const totp = generateOTP({ phone })

        console.log(totp)
        const { send_status } = await sendSMS(phone, ` ${totp} es su código de verificación de Chamoy`)
        if (envs.ERRORLOGS) console.log(send_status)

        return { message: "Código enviado" }
    }


    async checkCodeWithPhone(phone: string, code: string) {
        const isValid = verifyOTP({ phone }, code)

        if (!isValid) {
            return { message: 'Invalid code', verified: false };
        }
        return { message: 'Code verified', verified: true };
    }
}
