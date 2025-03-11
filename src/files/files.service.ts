import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';
import { rootDirectory } from './config/constants';
import { UserDocument } from 'src/users/schemas/user.schema';
import { v2 as cloudinary } from 'cloudinary';
import { envs } from 'src/config';

@Injectable()
export class FilesService {
  constructor(
    private readonly storageService: StorageService,
  ) { }

  async create(file: Express.Multer.File, user: UserDocument) {
    cloudinary.config({
      cloud_name: envs.CLOUDINARY_NAME,
      api_key: envs.CLOUDINARY_KEY,
      api_secret: envs.CLOUDINARY_SECRET
    })

    const filePath = await this.storageService.uploadFile(`${rootDirectory}`, file);

    const uploadResult = await cloudinary.uploader
      .upload(
        `${rootDirectory}/${filePath}`, {
        public_id: `${user._id}@${filePath.split('.')[0]}`,
        folder: 'chamoy',
      }
      )
      .catch((error) => {
        throw new HttpException({ message: 'Upload failed', stack: error, details: 'file.service.ts ln:30 Contact the developer' }, HttpStatus.SERVICE_UNAVAILABLE)
      });

    if (!uploadResult) throw new HttpException({ message: 'Upload failed', details: 'file.service.ts ln:33 Contact the developer' }, HttpStatus.SERVICE_UNAVAILABLE)

    const {secure_url} = uploadResult
    await this.storageService.deleteFile(`${rootDirectory}/${filePath}`)

    return { message: 'File created', secure_url};

  }

}


