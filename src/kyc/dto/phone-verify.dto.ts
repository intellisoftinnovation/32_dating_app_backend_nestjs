import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PhoneVerifyDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    code: string;
}