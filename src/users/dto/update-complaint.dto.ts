import { ApiProperty } from "@nestjs/swagger";
import {  IsEnum, IsNotEmpty } from "class-validator";
import { ComplaintStatus } from "../schemas/complaint.schema";

export class UpdateComplaintDto {
    @IsNotEmpty()
    @IsEnum(ComplaintStatus)
    @ApiProperty({ enum: ComplaintStatus })
    status: ComplaintStatus
}