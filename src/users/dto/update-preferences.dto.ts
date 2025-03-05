import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Appearance, BodyType, EnglishLevel, Etnicidad, FamilySituation, Language } from "../schemas/profile.schema";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class AgeRangeDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ type: Number, example: 18 })
    min: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ type: Number, example: 55 })
    max: number;
}


export class AlturaDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ type: Number, example: 120 })
    min: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ type: Number, example: 200 })
    max: number;
}

export class UpdatePreferenceDto {
    @IsArray()
    @IsEnum(Appearance, { each: true })
    @IsOptional()
    @ApiProperty()
    appearance: Appearance[];

    @IsArray()
    @IsEnum(Etnicidad, { each: true })
    @IsOptional()
    @ApiProperty()
    etnicidad: Etnicidad[];

    @IsOptional()
    @IsEnum(EnglishLevel, { each: true })
    @IsArray()
    @ApiProperty()
    englishLevel: EnglishLevel[];

    @IsOptional()
    @ValidateNested()
    @Type(() => AgeRangeDto)
    @ApiProperty()
    ageRange: AgeRangeDto;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty()
    distance: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => AlturaDto)
    @ApiProperty()
    altura: AlturaDto

    @IsOptional()
    @IsEnum(BodyType, { each: true })
    @IsArray()
    @ApiProperty()
    bodyType: BodyType[];

    @IsOptional()
    @IsBoolean({ each: true })
    // @Type(() => Boolean)
    @IsArray()
    @ApiProperty()
    smoking: boolean[];

    @IsOptional()
    @IsEnum(Language, { each: true })
    @IsArray()
    @ApiProperty()
    language: Language[];

    @IsOptional()
    @IsEnum(FamilySituation, { each: true })
    @IsArray()
    @ApiProperty()
    familySituation: FamilySituation[];
}