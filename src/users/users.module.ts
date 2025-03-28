import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { MetaData, MetaDataSchema } from './schemas/meta-data.schema';

import { AuthModule } from '../auth/auth.module';
import { PreferencesController } from './preferences.controller';
import { Preference, PreferenceSchema } from './schemas/preferences-schema';
import { MatchRequestModule } from 'src/match-request/match-request.module';
import { PaymentModule } from 'src/payment/payment.module';
import { Complaint, ComplaintSchema } from './schemas/complaint.schema';
import { ComplaintController } from './complaint.controller';
import { StatsController } from './stats.controller';
@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Profile.name, schema: ProfileSchema },
    { name: MetaData.name, schema: MetaDataSchema },
    { name: Preference.name, schema: PreferenceSchema },
    { name: Complaint.name, schema: ComplaintSchema },
  ]),
  forwardRef(() => AuthModule),
  forwardRef(() => MatchRequestModule), 
  forwardRef(() => PaymentModule),
  ],
  controllers: [UsersController, PreferencesController, ComplaintController, StatsController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
