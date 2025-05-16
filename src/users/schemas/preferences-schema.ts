import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Appearance, BodyType, EnglishLevel, Etnicidad, FamilySituation, Language, TypeOfRelationFind } from './profile.schema';
import { GeoLocation } from './geo-location.schema';

export type PreferenceDocument = HydratedDocument<Preference>;

export class Altura {
    @Prop({ type: Number, default: 120 })
    min: number;

    @Prop({ type: Number, default: 200 })
    max: number;
}

export class AgeRange {
    @Prop({ type: Number, default: 18, min: 18 })
    min: number;

    @Prop({ type: Number, default: 55 })
    max: number;
}

@Schema()
export class Preference {

    @Prop({ type: [String], enum: Object.values(Appearance), default: [] })
    appearance: Appearance[]

    @Prop({ type: [String], enum: Object.values(Etnicidad), default: [] })
    etnicidad: Etnicidad[];

    @Prop({ type: [String], enum: Object.values(EnglishLevel), default: [] })
    englishLevel: EnglishLevel[];

    @Prop({ type: AgeRange, default: () => new AgeRange() })
    ageRange: AgeRange;

    @Prop({ type: Number, default: 2500 })
    distance: number;

    @Prop({ type: Altura, default: () => new Altura() })
    altura: Altura;

    @Prop({ type: [String], enum: Object.values(BodyType), default: [] })
    bodyType: BodyType[];

    @Prop({ type: [Boolean], default: [] })
    smoking: boolean[];

    @Prop({ type: [String], enum: Object.values(Language), default: [] })
    language: Language[];

    @Prop({ type: [String], enum: Object.values(TypeOfRelationFind), default: [] })
    typeOfRelationFind: TypeOfRelationFind[];

    @Prop({ type: [String], enum: Object.values(FamilySituation), default: [] })
    familySituation: FamilySituation[];

    @Prop({ type: GeoLocation })
    geoLocations: GeoLocation;
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);