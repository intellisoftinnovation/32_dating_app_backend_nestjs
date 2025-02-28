import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class FindForLoginDto {
    
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'tester#@gmail.com'})
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}