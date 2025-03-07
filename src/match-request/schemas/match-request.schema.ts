import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type MatchRequestDocument = HydratedDocument<MatchRequest>;

export enum MatchRequestStatus { 
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}

@Schema({timestamps: true})
export class MatchRequest {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true })
    from: User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true })
    to: User

    @Prop({ type: Boolean , default: false})
    read: boolean

    @Prop({ type: String, enum: Object.values(MatchRequestStatus), default: MatchRequestStatus.PENDING })
    status: MatchRequestStatus
}


export const MatchRequestSchema = SchemaFactory.createForClass(MatchRequest)