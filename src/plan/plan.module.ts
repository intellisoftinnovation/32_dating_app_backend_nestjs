import { forwardRef, Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Plan, PlanSchema } from './schemas/plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema }
    ]),
    forwardRef(() => AuthModule)
  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports:[PlanService]
})
export class PlanModule { }
