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
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { PictureVerifyDto } from './dto/picture-verify.dto';


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
  @RateLimit(4, 60 * 1000)
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

  @Post('picture_verify')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilterImg,
  }))
  @ApiBody({
    description: 'Picture verification with file and coordinates for the verification rectangle',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Indica que se espera un archivo
        },
        x: {
          type: 'number',
          description: 'The x-coordinate of the rectangle for the picture verification',
        },
        y: {
          type: 'number',
          description: 'The y-coordinate of the rectangle for the picture verification',
        },
        rectangle_width: {
          type: 'number',
          description: 'The width of the rectangle for the picture verification',
        },
        rectangle_height: {
          type: 'number',
          description: 'The height of the rectangle for the picture verification',
        },
        deep: {
          type: 'string',
          enum: ['beta', 'pro'],
          description: 'The deep of the picture verification',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully verified picture',
  })
  async pictureVerify(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request,
    @Body() pictureVerifyDto: PictureVerifyDto
  ) {
    if (req.errors) {
      throw new HttpException({ message: req.errors.message }, req.errors.status);
    }

    if (!file) {
      throw new HttpException({ message: 'The file is required [file]' }, HttpStatus.BAD_REQUEST);
    }

    // TODO: Add file size validation

    return this.kycService.pictureVerify(file, pictureVerifyDto);
  }

  @Get('phoneVerify')
  @Auth()
  @RateLimit(3, 60 * 1000)
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
