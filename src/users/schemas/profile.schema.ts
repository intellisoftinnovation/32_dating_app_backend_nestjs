import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SocialNetwork } from './social-network.schema';
import { GeoLocation } from './geo-location.schema';
import { Profit } from './profit.schema';

export type ProfileDocument = HydratedDocument<Profile>;

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}


export enum Appearance {
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

export enum TypeOfRelationFind {
    FRIENDSHIP = "FRIENDSHIP",
    SERIOUS = "SERIOUS",
    CASUAL = "CASUAL",
    ONE_DAY = "ONE_DAY",
    DATE = "DATE",
    FWB = "FWB",
}

export enum Language {
    ENGLISH = "ENGLISH",
    SPANISH = "SPANISH",
}

export enum FamilySituation {
    NO_CHILDREN = "NO_CHILDREN",
    ONE_CHILD = "ONE_CHILD",
    TWO_CHILDREN = "TWO_CHILDREN",
    THREE_CHILDREN = "THREE_CHILDREN",
    FOOUR_OR_MORE = "FOUR_OR_MORE",
}

@Schema()
export class Profile {

    @Prop({ type: String, maxlength: 300, default: "" })
    description: string;

    @Prop({ type: String, enum: Object.values(Appearance), default: Appearance.AVERAGE })
    appearance: Appearance

    @Prop({ type: Date, default: () => new Date() })
    birthdate: Date;

    @Prop({ type: String, enum: Object.values(Gender), default: Gender.MALE, required: true })
    gender: Gender;

    @Prop({ type: [String], required: true, default: [] })
    photos: string[];

    @Prop({ type: [SocialNetwork], required: true, default: [] })
    socialNetworks: SocialNetwork[];

    @Prop({ type: GeoLocation, required: true, default: new GeoLocation() })
    geoLocations: GeoLocation;

    @Prop({ type: Number, default: 0 })
    altura: number;

    @Prop({ type: String, enum: Object.values(BodyType), default: BodyType.AVERAGE })
    bodyType: BodyType;

    @Prop({ type: Boolean, default: false })
    smoking: boolean;

    @Prop({ type: String, enum: Object.values(Language), default: Language.SPANISH })
    language: Language;

    @Prop({ type: String, enum: Object.values(FamilySituation), default: FamilySituation.NO_CHILDREN })
    familySituation: FamilySituation;

    @Prop({ type: Profit, default: () => new Profit() })
    profit: Profit;

    // FIXME: Add Phone Number

    @Prop({ type: Boolean, default: false, required: true })
    phoneVerified: boolean;

    @Prop({ type: Boolean, default: false, required: true })
    genderVerified: boolean;

    @Prop({ type: Boolean, default: false, required: true })
    polityAgreement: boolean;


    @Prop({ type: Boolean, default: false, required: true })
    onBoardingCompleted: boolean;

}




export const ProfileSchema = SchemaFactory.createForClass(Profile);