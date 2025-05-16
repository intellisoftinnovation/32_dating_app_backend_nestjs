import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyWithPhoneDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phone: string;
}