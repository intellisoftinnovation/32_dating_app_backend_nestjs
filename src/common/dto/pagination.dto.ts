import {  ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDto {

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number) 
  @ApiPropertyOptional()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional()
  size?: number = 20;
}
