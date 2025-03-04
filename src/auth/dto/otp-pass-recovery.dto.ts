import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class OtpPassRecoveryDto {   
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    otp: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    path: string;
}