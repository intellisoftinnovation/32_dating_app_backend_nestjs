import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config';
import { UsersModule } from './users/users.module';
import { APP_FILTER,  APP_PIPE } from '@nestjs/core';
import { CustomValidationPipe } from './Pipes/CustomValidationPipe';
import { QueryFailedFilter } from './Pipes/query-failed-exception.filter';
import { DatabaseConnectionExceptionFilter } from './Pipes/database-connection-exception.filter.ts';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { KycModule } from './kyc/kyc.module';
import { MatchRequestModule } from './match-request/match-request.module';
import { PaymentModule } from './payment/payment.module';
import { PlanModule } from './plan/plan.module';
// import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor';

@Module({
  imports: [
    MongooseModule.forRoot(envs.DB_URI),
    AuthModule,
    UsersModule,
    FilesModule,
    KycModule,
    MatchRequestModule,
    PaymentModule,
    PlanModule
  ],
  providers: [
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
      useClass: QueryFailedFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useFactory: (reflector: Reflector) => new RateLimitInterceptor(reflector),
    //   inject: [Reflector]
    // }
  ]
})
export class AppModule { }
