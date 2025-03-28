import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionDto{

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    plan_id: string
    
}

