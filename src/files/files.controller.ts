import { Controller, Post, UseInterceptors, Req, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterImg } from './helpers/fileFilters.helpers';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ApiTags, ApiConsumes, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post()
  @Auth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilterImg
  }))
  @ApiResponse({
    status: 503,
    description: 'File upload failed, contact the developer'
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
  @RateLimit(10, 60*1000)
  create(@UploadedFile() file: Express.Multer.File, @Req() req: Express.Request, @GetUser() user: UserDocument) {

    if (req.errors) {
      throw new HttpException({ message: req.errors.message }, req.errors.status);
    }

    if (!file) {
      throw new HttpException({ message: 'The file is required [file]' }, HttpStatus.BAD_REQUEST);
    }

    // TODO: Add file size validation

    return this.filesService.create(file, user);
  }
}
