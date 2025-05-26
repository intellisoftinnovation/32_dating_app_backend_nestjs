import { Module, forwardRef } from '@nestjs/common';
import { MatchRequestService } from './match-request.service';
import { MatchRequestController } from './match-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchRequest, MatchRequestSchema } from './schemas/match-request.schema';
import { UsersModule } from 'src/users/users.module';
import { PaymentModule } from 'src/payment/payment.module';
import { User, UserSchema } from '../users/schemas/user.schema'; 
import { AuthModule } from 'src/auth/auth.module';
import { FirebaseAdminService } from 'src/helpers/firebase-admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchRequest.name, schema: MatchRequestSchema },
      { name: User.name, schema: UserSchema }, 
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => PaymentModule),
  ],
  controllers: [MatchRequestController],
  providers: [MatchRequestService, FirebaseAdminService],
  exports: [MatchRequestService],
})
export class MatchRequestModule {}
