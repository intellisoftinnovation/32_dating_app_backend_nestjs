import { Body, Controller,  Get,  Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('test')
  async test() {
    return this.paymentService.test();
  }

  @Post('subcribehook')
  async subscribe(@Body() data:any) {
    return this.paymentService.subscribeHook(data);
  }

  @Get('getSubscriptions')
  async getSubscriptions() {
    return this.paymentService.getSubscriptions();
  }

  @Get('getPlans')
  async getPlans() {
    return this.paymentService.getPlans();
  }

  @Post('newSubscription')
  async newSubscription() {
    return this.paymentService.newSubscription();
  }
  
}
