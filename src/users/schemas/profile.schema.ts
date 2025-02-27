import { Prop,  Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SocialNetwork } from './social-network.schema';
import { GeoLocation } from './geo-location.schema';
import { Profit } from './profit.schema';

export type ProfileDocument = HydratedDocument<Profile>;

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}


export enum Appearance{
    ATTRACTIVE = 'ATTRACTIVE',
    AVERAGE = 'AVERAGE',
    UNATTRACTIVE = 'UNATTRACTIVE',
    VERY_ATTRACTIVE = 'VERY_ATTRACTIVE',
}

export enum BodyType {
    ATHETIC = 'ATHETIC',
    AVERAGE = 'AVERAGE',
    THIN = 'THIN',
    CURVY = 'CURVY',
    OVERWEIGHT = 'OVERWEIGHT',
}

export enum TypeOfRelationFind{
    FRIENDSHIP = "FRIENDSHIP",
    SERIOUS    = "SERIOUS",
    CASUAL     = "CASUAL",
    ONE_DAY    = "ONE_DAY",
    DATE       = "DATE",
    FWB        = "FWB",
}

export enum Language{
    ENGLISH = "ENGLISH",
    SPANISH = "SPANISH",
}

export enum FamilySituation{
    ONE_CHILD      = "ONE_CHILD",
    TWO_CHILDREN   = "TWO_CHILDREN",
    THREE_CHILDREN = "THREE_CHILDREN",
    FOOUR_OR_MORE  = "FOUR_OR_MORE",
}

@Schema()
export class Profile {

    @Prop({ type: String, maxlength: 300 })
    description: string;

    @Prop({type: String , enum: Object.values(Appearance)})
    appearance: Appearance

    @Prop({ type: Date})
    birthdate: Date;

    @Prop({ type: String, enum: Object.values(Gender), default: Gender.MALE, required: true })
    gender: Gender;

    @Prop({ type: [String], required: true, default: []})
    fotos: string[];

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId , ref: 'SocialNetwork'}], required: true, default: []})
    socialNetworks: SocialNetwork[];

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId , ref: 'GeoLocation'}], required: true, default: []})
    geoLocations: GeoLocation[];

    @Prop({type: Number})
    altura: number;

    @Prop({ type: String, enum: Object.values(BodyType)})
    bodyType: BodyType;

    @Prop({ type: Boolean})
    smoking: boolean;

    @Prop({ type: String, enum: Object.values(Language)})
    language: Language;

    @Prop({ type: String, enum: Object.values(FamilySituation)})
    familySituation: FamilySituation;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Profit'})
    profit: Profit;

}




export const ProfileSchema = SchemaFactory.createForClass(Profile);