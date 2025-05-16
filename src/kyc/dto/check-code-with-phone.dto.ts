import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CheckCodeWithPhoneDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phone: string; 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    code: string
}