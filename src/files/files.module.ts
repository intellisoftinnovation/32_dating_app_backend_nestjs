import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AuthModule } from 'src/auth/auth.module';
import { StorageService } from './storage.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule)
  ],
  controllers: [FilesController],
  providers: [FilesService, StorageService],
  exports: [FilesService]
})
export class FilesModule { }
