import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CustomValidationPipe } from './Pipes/CustomValidationPipe';
import { QueryFailedFilter } from './Pipes/query-failed-exception.filter';
import { DatabaseConnectionExceptionFilter } from './Pipes/database-connection-exception.filter.ts';
@Module({
  imports: [MongooseModule.forRoot(envs.DB_URI), UsersModule],
  providers:[
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseConnectionExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedFilter ,
    },
  ]
})
export class AppModule {}
