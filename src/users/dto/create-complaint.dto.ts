import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ComplaintType } from "../schemas/complaint.schema";

export class CreateComplaintDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({enum: Object.values(ComplaintType)})
    type: ComplaintType;
}