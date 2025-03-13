import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from './schemas/plan.schema';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {

    constructor(
        @InjectModel(Plan.name) private readonly planModel:Model<Plan>
    ){}
    
    async getPlans() {
        const planes = await this.planModel.find();
        return { message: "Get Plans Success", planes };
    }

    async createPlan(createPlanDto: CreatePlanDto) {
        const tempPlan = await this.planModel.create({ ...createPlanDto })
        return { message: "Create Plan Success", id:tempPlan.id };
    }

    async updatePlan(id: string, updatePlanDto: UpdatePlanDto) {
        const tempPlan = await this.planModel.findByIdAndUpdate(id, { ...updatePlanDto });
        return { message: "Update Plan Success", id:tempPlan.id };
    }

    async getPlanById(id: string) {
        const plan = await this.planModel.findById(id);
        return { message: "Get Plan By Id Success", plan };
    }

}
