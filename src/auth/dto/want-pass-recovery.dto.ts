import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class WantPassRecoveryDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}