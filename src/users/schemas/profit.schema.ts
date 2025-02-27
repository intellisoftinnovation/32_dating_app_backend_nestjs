import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { HydratedDocument } from 'mongoose';

export type ProfitDocument = HydratedDocument<Profit>;

export enum Currency{
    SOL = 'SOL',
}

@Schema()
export class Profit {
    @Prop({ type: Number, required: true , default: 0})
    min: number;

    @Prop({ type: Number, required: true , default: 1})
    max: number;

    @Prop({ type: String, enum: Object.values(Currency), required: true , default: Currency.SOL})
    currency: string;
}

export const ProfitSchema = SchemaFactory.createForClass(Profit);
