import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GeoLocationDocument = HydratedDocument<GeoLocation>;
@Schema()
export class GeoLocation {
    @Prop({ type: Number, required: true, default: 0 })
    latitude: number;

    @Prop({ type: Number, required: true, default: 0 })
    longitude: number;

    @Prop({ type: String})
    country: string;
    
    @Prop({ type: String})
    city: string;

}

export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);