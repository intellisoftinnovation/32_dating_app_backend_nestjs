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

export enum Etnicidad{
    AFRO      = "AFRO",
    AMERICANO = "AMERICANO",
    ASIATICO  = "ASIATICO",
    MESTIZO   = "MESTIZO",
    LATINO    = "LATINO",
    BLANCO    = "BLANCO"
}

export enum EnglishLevel {
    MALO  = "MALO",
    MEDIO = "MEDIO",
    BUENO = "ALTO",
    FLUIDO = "FLUIDO",
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

    @Prop({ type: String, maxlength: 300})
    description: string;

    @Prop({ type: String, enum: Object.values(Appearance)})
    appearance: Appearance

    @Prop({Type: String, enum: Object.values(Etnicidad)})
    etnicidad: Etnicidad;

    @Prop({ type: String, enum: Object.values(EnglishLevel)})
    englishLevel: EnglishLevel;

    @Prop({ type: Date })
    birthdate: Date;



    @Prop({ type: String, enum: Object.values(Gender)})
    gender: Gender;

    //TODO:  Limitar a 6 Fotos
    @Prop({ type: [String] })
    photos: string[];

    @Prop({ type: [SocialNetwork]})
    socialNetworks: SocialNetwork[];

    @Prop({ type: GeoLocation })
    geoLocations: GeoLocation;

    @Prop({ type: Number})
    altura: number;

    @Prop({ type: String, enum: Object.values(BodyType)})
    bodyType: BodyType;

    @Prop({ type: Boolean})
    smoking: boolean;

    @Prop({ type: String , enum: Object.values(TypeOfRelationFind)})
    typeOfRelationFind: TypeOfRelationFind;

    @Prop({ type: String, enum: Object.values(Language)})
    language: Language;

    @Prop({ type: String, enum: Object.values(FamilySituation)})
    familySituation: FamilySituation;

    

    @Prop({ type: Profit})
    profit: Profit;

    @Prop({ type: String})
    phone: string; 

    @Prop({ type: Boolean, default: false, required: true })
    phoneVerified: boolean;

    @Prop({ type: Boolean, default: false, required: true })
    genderVerified: boolean;

    @Prop({ type: Boolean, default: false, required: true })
    polityAgreement: boolean;

    @Prop({ type: Boolean, default: false, required: true })
    onBoardingCompleted: boolean;

    @Prop({type: Number, default: 0})
    request: number ;

}


export const ProfileSchema = SchemaFactory.createForClass(Profile);