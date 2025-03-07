import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { MatchRequestStatus } from "../schemas/match-request.schema";

export enum Side {
    FROM = "FROM",
    TO = "TO"
}

export class GetMatchRequestDto extends PaginationDto {
    @IsEnum(Side)
    @IsNotEmpty()
    @ApiPropertyOptional({ enum: Side, default: Side.FROM })
    side: Side = Side.FROM

    @IsEnum(MatchRequestStatus)
    @IsNotEmpty()
    @ApiPropertyOptional({ enum: MatchRequestStatus, default: MatchRequestStatus.PENDING })
    status: MatchRequestStatus = MatchRequestStatus.PENDING

}