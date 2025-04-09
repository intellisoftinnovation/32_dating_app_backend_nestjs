import { Body, Controller,Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  
  // @Post('subcribehook')
  async subscribe(@Body() data:any) {
    return this.paymentService.subscribeHook(data);
  }

  @Post('newSubscription')
  @Auth()
  async newSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto, @GetUser('_id') idInToken: string) {
    return this.paymentService.newSubscription(createSubscriptionDto , idInToken);
  }

  
  


}
