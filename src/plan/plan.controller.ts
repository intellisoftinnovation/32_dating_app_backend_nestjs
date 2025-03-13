import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PlanService } from './plan.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ItPrivileges } from 'src/auth/interfaces/ItPrivileges';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) { }

  @Get('getPlans')
  @Auth()
  async getPlans() {
    return await  this.planService.getPlans()
  }

  @Post()
  @Auth(ItPrivileges.ALL_PRIVILEGES)
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    return await  this.planService.createPlan(createPlanDto)
  }

  @Patch(':id')
  @Auth(ItPrivileges.ALL_PRIVILEGES)
  async updatePlan(@Body() updatePlanDto: UpdatePlanDto, @Param('id') id: string) {
    return await  this.planService.updatePlan(id, updatePlanDto)
  }



}
