import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsNumber, IsBoolean} from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Appearance, Etnicidad, EnglishLevel, BodyType, Language, FamilySituation, Gender, TypeOfRelationFind } from "../schemas/profile.schema";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { GeoLocationDto } from "./update-user.dto";

export enum SortBy {
    HOT = "HOT",
    NEW = "NEW"
}

export enum Enviroment {
    PRODUCTION = "PRODUCTION",
    DEVELOPMENT = "DEVELOPMENT"
}

export class GetUsersDto extends PaginationDto {
    @IsArray()
    @IsEnum(Appearance, { each: true })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @ApiPropertyOptional({ isArray: true, enum: Appearance })
    appearance: Appearance[];


    @IsArray()
    @IsEnum(Etnicidad, { each: true })
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @ApiPropertyOptional({ isArray: true, enum: Etnicidad })
    etnicidad: Etnicidad[];

    @IsOptional()
    @IsEnum(EnglishLevel, { each: true })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @ApiPropertyOptional({ isArray: true, enum: EnglishLevel })
    englishLevel: EnglishLevel[];

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiPropertyOptional()
    altura_min: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiPropertyOptional()
    altura_max: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiPropertyOptional()
    age_min: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiPropertyOptional()
    age_max: number

    @IsOptional()
    @Transform(({ value }) => {
        try {
            // console.log(value)
            // console.log(JSON.parse(value))
            return typeof value === 'string' ? JSON.parse(value) : value;

        } catch {
            return undefined;
        }
    })
    // @ValidateNested()
    @Type(() => GeoLocationDto)
    @ApiPropertyOptional({ type: GeoLocationDto })
    geoLocation?: GeoLocationDto;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiPropertyOptional()
    distance: number;

    @IsOptional()
    @IsEnum(BodyType, { each: true })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @ApiPropertyOptional({ isArray: true, enum: BodyType })
    bodyType: BodyType[];

    @IsOptional()
    @IsBoolean({ each: true })
    @IsArray()
    @Transform(({ value }) => {
        if (value === 'true') {
            return [true];
        } else if (value === 'false') {
            return [false];
        }
        return Array.isArray(value) ? value.map(v => v === 'true') : [value === 'true'];
    })
    @ApiPropertyOptional({ isArray: true, type: Boolean })
    smoking: boolean[];

    @IsOptional()
    @IsEnum(Language, { each: true })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @ApiPropertyOptional({ isArray: true, enum: Language })
    language: Language[];

    @IsOptional()
    @IsEnum(TypeOfRelationFind, { each: true })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @ApiPropertyOptional({ isArray: true, enum: TypeOfRelationFind })
    typeOfRelationFind: TypeOfRelationFind[];

    @IsOptional()
    @IsEnum(FamilySituation, { each: true })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @ApiPropertyOptional({ isArray: true, enum: FamilySituation })
    familySituation: FamilySituation[];

    @IsOptional()
    @IsEnum(Gender, { each: true })
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @ApiPropertyOptional({ isArray: true, enum: Gender, default: [Gender.FEMALE] })
    gender: Gender[] = [Gender.FEMALE];


    @IsOptional()
    @IsEnum(SortBy)
    @ApiPropertyOptional({ enum: SortBy, default: SortBy.NEW })
    sortBy: SortBy = SortBy.NEW;

    @IsOptional()
    @IsEnum(Enviroment)
    @ApiPropertyOptional({ enum: Enviroment, default: Enviroment.PRODUCTION })
    enviroment: Enviroment = Enviroment.PRODUCTION

}