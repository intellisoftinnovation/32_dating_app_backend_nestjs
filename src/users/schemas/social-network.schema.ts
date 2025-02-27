import { Prop, Schema,SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SocialNetworkDocument = HydratedDocument<SocialNetwork>;

export enum SocialNetworks{
    INSTAGRAM = 'INSTAGRAM',
    FACEBOOK = 'FACEBOOK',
}

@Schema()
export class SocialNetwork {
    @Prop({ type: String, enum: Object.values(SocialNetworks), required: true })
    socialNetwork: SocialNetworks;

    @Prop({ type: String, required: true })
    username: string;
}

export const SocialNetworkSchema = SchemaFactory.createForClass(SocialNetwork);