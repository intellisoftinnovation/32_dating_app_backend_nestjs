import {Prop , Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';

import { MetaData } from './meta-data.schema';
import { Profile } from './profile.schema';
import { Preference } from './preferences-schema';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
  @Prop({required: true, type: String , unique: true})
  email: string;

  @Prop({required: true , type: String  })
  password: string;

  @Prop({required: true , type: String, default: 'Chomy User'})
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId , ref: 'MetaData' ,  index: true })
  metaData: MetaData;

  @Prop({ type: mongoose.Schema.Types.ObjectId , ref: 'Profile' ,  index: true  })
  profile: Profile

  @Prop({ type: mongoose.Schema.Types.ObjectId , ref: 'Preference',  index: true })
  preference: Preference;

  @Prop({ type: String})
  inc_id: string;
  
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(autoIncrement, { model: 'User', field: 'inc_id' });