import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {  UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { MetaData, MetaDataSchema } from './schemas/meta-data.schema';

import { AuthModule } from '../auth/auth.module';
import { PreferencesController } from './preferences.controller';
import { Preference, PreferenceSchema } from './schemas/preferences-schema';
@Module({
  imports:[MongooseModule.forFeature([
    {name: User.name , schema: UserSchema},
    {name: Profile.name , schema: ProfileSchema},
    {name: MetaData.name , schema: MetaDataSchema},
    {name: Preference.name , schema: PreferenceSchema}
  ]), 
  forwardRef(() => AuthModule)
],
  controllers: [UsersController, PreferencesController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
