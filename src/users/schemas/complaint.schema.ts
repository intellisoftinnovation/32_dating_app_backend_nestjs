import {Prop , Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import { User } from './user.schema';

export type ComplaintDocument = HydratedDocument<Complaint>;

export enum ComplaintStatus { 
  PENDING   = "PENDING",
  IN_REVIEW = "IN_REVIEW", 
  SOLVED    = "SOLVED"
}

@Schema({timestamps: true})
export class Complaint {
  @Prop({required: true , type: mongoose.Schema.Types.ObjectId , ref: 'User' })
  owner: User

  @Prop({required: true , type: mongoose.Schema.Types.ObjectId , ref: 'User' })
  subjet: User

  @Prop({type: String })
  description: string;

  @Prop({ type: String, enum: Object.values(ComplaintStatus)})
  status: ComplaintStatus

}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);