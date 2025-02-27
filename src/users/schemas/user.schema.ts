import {Prop , Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';

import { MetaData } from './meta-data.schema';
import { Profile } from './profile.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true, type: String , unique: true})
  email: string;

  @Prop({required: true , type: String  })
  password: string;

  @Prop({required: true , type: String, default: 'Chomy User'})
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId , ref: 'MetaData'})
  metaData: MetaData;

  @Prop({ type: mongoose.Schema.Types.ObjectId , ref: 'Profile'  })
  profile: Profile
  
}

export const UserSchema = SchemaFactory.createForClass(User);