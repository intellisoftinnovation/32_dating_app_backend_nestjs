import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports:[
    forwardRef(()=> AuthModule),
    forwardRef(()=> PlanModule), 
    
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports:[PaymentService]
})
export class PaymentModule {}
