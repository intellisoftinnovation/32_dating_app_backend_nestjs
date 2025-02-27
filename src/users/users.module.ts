import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { MetaData, MetaDataSchema } from './schemas/meta-data.schema';
import { GeoLocation, GeoLocationSchema } from './schemas/geo-location.schema';
import { SocialNetwork, SocialNetworkSchema } from './schemas/social-network.schema';
import { Profit, ProfitSchema } from './schemas/profit.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name: User.name , schema: UserSchema},
    {name: Profile.name , schema: ProfileSchema},
    {name: MetaData.name , schema: MetaDataSchema},
    {name: GeoLocation.name , schema: GeoLocationSchema },
    {name: SocialNetwork.name , schema: SocialNetworkSchema },
    {name: Profit.name , schema: ProfitSchema },
  ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[]
})
export class UsersModule {}
