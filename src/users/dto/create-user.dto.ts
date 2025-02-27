import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    // TODO: Add max length and min length
    @ApiProperty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    // TODO: Add password regex
    @ApiProperty()
    password: string;
}