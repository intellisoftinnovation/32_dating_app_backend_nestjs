import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ItPrivileges as  Privileges } from '../../auth/interfaces/ItPrivileges';

export type MetaDataDocument = HydratedDocument<MetaData>;

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    DELETED = 'DELETED',
}

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
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

    @Prop({ type: String, default: "" , select: false })
    active_session: string
}

export const MetaDataSchema = SchemaFactory.createForClass(MetaData);