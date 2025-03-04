import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Appearance, BodyType, englishLevel, Etnicidad, FamilySituation, Gender, Language } from '../schemas/profile.schema';
import { SocialNetworks } from '../schemas/social-network.schema';
import { Transform, Type } from 'class-transformer';
import { Currency } from '../schemas/profit.schema';

export class SocialNetworkDto {
    @IsNotEmpty()
    @IsEnum(SocialNetworks)
    @ApiProperty({ enum: SocialNetworks })
    socialNetwork: SocialNetworks;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    username: string;
}


export class GeoLocationDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ type: Number, example: 40.7128 })
    latitude: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ type: Number, example: -74.0060 })
    longitude: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String, example: 'United States' })
    country?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String, example: 'New York' })
    city?: string;
}


export class ProfitDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ type: Number, example: 10 })
    min: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ type: Number, example: 20 })
    max: number;

    @IsNotEmpty()
    @IsEnum(Currency)
    @ApiProperty({ enum: Currency })
    @IsOptional()
    currency?: Currency;
}


export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiProperty()
    name?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @IsEmail()
    @ApiProperty()
    email?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    // TODO: Add password regex
    @ApiProperty()
    password?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiProperty()
    description?: string

    @IsNotEmpty()
    @IsOptional()
    @IsEnum(Appearance)
    @ApiProperty({ enum: Appearance })
    appearance?: Appearance

    @IsNotEmpty()
    @IsOptional()
    @IsEnum(Etnicidad)
    @ApiProperty({ enum: Etnicidad })
    etnicidad?: Etnicidad

    @IsNotEmpty()
    @IsOptional()
    @IsEnum(englishLevel)
    @ApiProperty({ enum: englishLevel })
    englishLevel?: englishLevel

    @IsNotEmpty()
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    @ApiProperty({ type: Date })
    birthdate?: Date


    @IsNotEmpty()
    @IsOptional()
    @IsEnum(Gender)
    @ApiProperty({ enum: Gender })
    gender?: Gender

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ type: [String] })
    photos?: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SocialNetworkDto)
    @ApiProperty({ type: [SocialNetworkDto] })
    socialNetworks?: SocialNetworkDto[];

    @IsOptional()
    @ValidateNested()
    @Type(() => GeoLocationDto)
    @ApiProperty({ type: GeoLocationDto })
    geoLocation?: GeoLocationDto;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ type: Number })
    altura?: number;

    @IsOptional()
    @IsEnum(BodyType)
    @ApiProperty({ enum: BodyType })
    bodyType?: BodyType;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    @ApiProperty({ type: Boolean })
    smoking?: boolean;

    @IsOptional()
    @IsEnum(Language)
    @ApiProperty({ enum: Language })
    language?: Language;

    @IsOptional()
    @IsEnum(FamilySituation)
    @ApiProperty({ enum: FamilySituation })
    familySituation?: FamilySituation;

    @IsOptional()
    @ValidateNested()
    @Type(() => ProfitDto)
    @ApiProperty({ type: ProfitDto })
    profit?: ProfitDto;

    @IsOptional()
    @IsString()
    @ApiProperty()
    phone?: string

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    @Type(() => Boolean)
    polityAgreement?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    @Type(() => Boolean)
    onBoardingCompleted?: boolean;  
}