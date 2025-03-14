import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateComplaintDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
}