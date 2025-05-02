import { forwardRef, Module } from '@nestjs/common';
import { MatchRequestService } from './match-request.service';
import { MatchRequestController } from './match-request.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MatchRequest, MatchRequestSchema } from './schemas/match-request.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from 'src/payment/payment.module';
import { FirebaseAdminService } from 'src/helpers/firebase-admin.service';

@Module({
  imports: [
    forwardRef(()=> AuthModule),
    forwardRef(()=> UsersModule),
    forwardRef(()=> PaymentModule),
    MongooseModule.forFeature([
      {name: MatchRequest.name , schema: MatchRequestSchema}
    ])
  ],
  controllers: [MatchRequestController],
  providers: [MatchRequestService, FirebaseAdminService],
  exports: [MatchRequestService]
})
export class MatchRequestModule {}
