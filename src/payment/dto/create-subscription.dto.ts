import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionDto{

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({default:'test_user_1415234644@testuser.com'})
    payer_email: string 

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    plan_id: string


}

