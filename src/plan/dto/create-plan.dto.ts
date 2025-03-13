import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { PlanCurrency, PlanFrecuency } from "../../plan/schemas/plan.schema"

export class CreatePlanDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'Nombre del Plan'})
    reason: string

    @IsNotEmpty()
    @Type(()=> Number)
    @IsNumber()
    @ApiProperty({example: 1})
    frequency: number

    @IsNotEmpty()
    @IsEnum(PlanFrecuency)
    @ApiProperty({enum: PlanFrecuency})
    frequency_type: PlanFrecuency

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({example: 10})
    transaction_amount: number

    @IsNotEmpty()
    @IsEnum(PlanCurrency)
    @ApiProperty({enum: PlanCurrency})
    currency_id: PlanCurrency

}
