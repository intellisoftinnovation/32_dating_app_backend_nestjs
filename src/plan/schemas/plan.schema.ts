import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlanDocument = HydratedDocument<Plan>

export enum PlanFrecuency {
    days = "days"    , 
    months = "months"
}

export enum PlanCurrency {
    PEN = "PEN"
}

@Schema()
export class Plan {
    @Prop({ required: true, type: String })
    reason: string

    @Prop({type: Number, required: true })
    frequency: number

    @Prop({type: String, enum: Object.values(PlanFrecuency), required: true, default: PlanFrecuency.months})
    frequency_type: PlanFrecuency

    @Prop({type: Number , required: true })
    transaction_amount: number

    @Prop({type: String, required: true, enum: Object.values(PlanCurrency) , default: PlanCurrency.PEN})
    currency_id: PlanCurrency

}



export const PlanSchema = SchemaFactory.createForClass(Plan)