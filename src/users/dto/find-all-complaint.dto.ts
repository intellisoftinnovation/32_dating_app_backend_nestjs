import { PaginationDto } from "src/common/dto/pagination.dto";
import { ComplaintStatus, ComplaintType } from "../schemas/complaint.schema";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export class FindAllComplaintsDto extends PaginationDto {
    @IsOptional()
    @IsEnum(ComplaintStatus)
    @ApiPropertyOptional({ enum: ComplaintStatus })
    status: ComplaintStatus

    @IsOptional()
    @IsEnum(ComplaintType)
    @ApiPropertyOptional({enum: ComplaintType})
    type: ComplaintType
}

