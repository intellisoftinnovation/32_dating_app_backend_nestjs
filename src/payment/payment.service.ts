import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { envs } from 'src/config';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { PlanService } from 'src/plan/plan.service';

@Injectable()
export class PaymentService {
    private client: MercadoPagoConfig;

    constructor(
        @Inject(forwardRef(() => PlanService)) private readonly planService: PlanService
    ) {
        this.client = new MercadoPagoConfig({
            accessToken: envs.MERCADOPAGO_ACCESS_TOKEN,
            options: { timeout: 5000, idempotencyKey: 'abc' }
        });
    }

    async newSubscription(createSubscriptionDto: CreateSubscriptionDto, idInToken: string) {
        const { payer_email, plan_id } = createSubscriptionDto

        const { plan } = await this.planService.getPlanById(plan_id);

        const preApproval = new PreApproval(this.client);
        const results = await preApproval.create({
            body: {
                status: "pending",
                payer_email: payer_email,
                back_url: "https://processors-nobody-mortality-tuner.trycloudflare.com/api/0.0.1/payment/subcribehook",
                reason: plan.reason,
                auto_recurring: {
                    frequency: plan.frequency,
                    frequency_type: plan.frequency_type,
                    transaction_amount: plan.transaction_amount,
                    currency_id: plan.currency_id
                },
                external_reference: `${idInToken}`,
            }
        });

        return { message: "New Subscription Success", link: results.init_point };
    }


    async getActiveSubscriptions() {
        const preApproval = new PreApproval(this.client);
        const results = await preApproval.search({
            options: {
                status: "active"
            }
        });
        return results;
    }

    async test(idInToken: string) {

        return idInToken;
    }

    async isPremiumUser(idInToken: string) {
        const preApproval = new PreApproval(this.client);
        const LIMIT = 100;
        let offset = 0;
        let premium = false;
        let resultsArray: any[] = [];

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        do {
            const results = await preApproval.search({
                options: {
                    status: "authorized",
                    limit: LIMIT,
                    offset: offset
                }
            });

            // console.log(results);
            resultsArray = resultsArray.concat(results.results);

            results.results.forEach(element => {
                if (element.external_reference.toString() === idInToken) {
                    premium = true;
                }
            });

            if (results.results.length < LIMIT) break;

            offset += LIMIT;

            if (!premium) await delay(500);
            // console.log(`Fetching next ${LIMIT} results...`);
        } while (!premium);

        return premium;
    }

    async subscribeHook(data: any) {
        console.log(data);
    }
}
