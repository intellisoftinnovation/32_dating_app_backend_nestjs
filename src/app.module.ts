import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config';
@Module({
  imports: [MongooseModule.forRoot(envs.DB_URI)],
})
export class AppModule {}
