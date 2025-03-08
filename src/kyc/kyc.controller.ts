import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { KycService } from './kyc.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterImg } from 'src/files/helpers/fileFilters.helpers';
import { FacePlusVerifyCode } from './helpers/face-plus-gender-verify';
import { PhoneVerifyDto } from './dto/phone-verify.dto';


@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {
  }

  @Post('gender_verify')
  @Auth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilterImg
  }))
  @ApiResponse({ status: 412, description: 'Precondition failed, gender not selected' })
  @ApiResponse({
    status: 503,
    description: 'File upload failed, contact the developer',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    example: {
      message: 'Gender mismatch',
      code: FacePlusVerifyCode.GENDER_MISMATCH,
      verified: false
    }
  })
  async genderVerify(@UploadedFile() file: Express.Multer.File, @Req() req: Express.Request, @GetUser() user: UserDocument) {

    if (req.errors) {
      throw new HttpException({ message: req.errors.message }, req.errors.status);
    }

    if (!file) {
      throw new HttpException({ message: 'The file is required [file]' }, HttpStatus.BAD_REQUEST);
    }

    // TODO: Add file size validation

    return this.kycService.genderVerify(file, user);
  }

  @Get('phoneVerify')
  @Auth()
  async phoneVerifyRequest(@GetUser() user: UserDocument) {
    return this.kycService.phoneVerifyRequest(user);
  }

  @Post('phoneVerify')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async phoneVerify(@GetUser() user: UserDocument, @Body() phoneVerifyDto: PhoneVerifyDto) {
    return this.kycService.phoneVerify(user, phoneVerifyDto.code);
  }


}
