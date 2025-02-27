import {Prop , Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';

import { MetaData } from './meta-data.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true, type: String , unique: true})
  email: string;

  @Prop({required: true , type: String  })
  password: string;

  @Prop({required: true , type: String, default: 'Chomy User'})
  name: string;

  @Prop({required: true , type: mongoose.Schema.Types.ObjectId , ref: 'MetaData'})
  metaData: MetaData;
  
}

export const UserSchema = SchemaFactory.createForClass(User);