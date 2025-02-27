import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MetaDataDocument = HydratedDocument<MetaData>;

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'SUSPENDED',
}

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum Privileges {
    DEFAULT = 'DEFAULT',
    // TODO: Create privilege about security strategy
}


@Schema()
export class MetaData {
    @Prop({ type: Date, default:  () => new Date() })
    createdAt: Date;

    @Prop({ type: String, enum: Object.values(AccountStatus), default: AccountStatus.ACTIVE, required: true })
    accountStatus: AccountStatus;

    @Prop({ type: Date, default:  () => new Date(), required: true })
    lastConnection: Date;

    @Prop({ type: Boolean, default: false, required: true })
    isAdmin: boolean;

    @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.USER, required: true })
    userRole: UserRole;

    @Prop({ type: [String], enum: Object.values(Privileges), default: [Privileges.DEFAULT], required: true })
    privileges: Privileges[]; 

    @Prop({ type: Boolean, default: false , required: true })
    phoneVerified: boolean; 

    @Prop({ type: Boolean, default: false , required: true })
    genderVerified: boolean;

    @Prop({ type: Boolean, default: false , required: true })
    polityAgreement: boolean;


    @Prop({ type: Boolean, default: false , required: true })
    onBoardingCompleted: boolean;

}

export const MetaDataSchema = SchemaFactory.createForClass(MetaData);