import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export enum ComplaintAction {
    DELETE = "DELETE",
    SUSPEND = "SUSPEND",
    VERIFY_GENDER = "VERIFY_GENDER",   
}

export class ComplaintActionDto {
    @IsEnum(ComplaintAction)
    @IsNotEmpty()
    @ApiProperty({ enum: ComplaintAction })
    action: ComplaintAction
}