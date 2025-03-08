import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval, PreApprovalPlan } from 'mercadopago';
import { envs } from 'src/config';

@Injectable()
export class PaymentService {
    private client: MercadoPagoConfig;

    constructor() {
        this.client = new MercadoPagoConfig({
            accessToken: envs.MERCADOPAGO_ACCESS_TOKEN,
            options: { timeout: 5000, idempotencyKey: 'abc' }
        });

    }

    async test() {
        const preApprovalPlan = new PreApprovalPlan(this.client)
        const results = await preApprovalPlan.search();
        // results.results.forEach(async element => {
        //     await preApprovalPlan.update({id:element.id,updatePreApprovalPlanRequest:{
        //         back_url: 'https://processors-nobody-mortality-tuner.trycloudflare.com/api/0.0.1/payment/subcribehook'
        //     }});

        // });
        return { message: "Test Succes", results };
    }

    async getPlans() {
        const preApprovalPlan = new PreApprovalPlan(this.client)
        const results = await preApprovalPlan.search();
        return { message: "Get Plans Success", results };
    }

    async getSubscriptions() {
        const preApproval = new PreApproval(this.client);
        const results = await preApproval.search();
        return { message: "Get Subscriptions Success", results };
    }

    async newSubscription() {
        const preApproval = new PreApproval(this.client);
        const results = await preApproval.create({
            body: {
                status: "pending",
                payer_email: "babyyoda62406@gmail.com",
                back_url: "https://processors-nobody-mortality-tuner.trycloudflare.com/api/0.0.1/payment/subcribehook",
                reason: "Test",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: 2,
                    currency_id: "PEN"
                }
            }
        });
        return { message: "New Subscription Success", results };
    }

    async subscribeHook(data: any) {
        console.log(data);
    }
}
