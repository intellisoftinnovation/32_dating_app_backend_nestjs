import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator"

export enum VerifyDeep {
    BETA = 'beta',
    PRO = 'pro'
}

export class PictureVerifyDto {

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    @ApiProperty()
    x: number

    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    @ApiProperty()
    y: number

    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    @ApiProperty()
    rectangle_width: number
    
    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    @ApiProperty()
    rectangle_height: number
 
    @IsEnum(VerifyDeep)
    @IsNotEmpty()
    @Type(()=>String)
    @ApiProperty()
    deep: VerifyDeep
}