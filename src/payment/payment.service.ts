import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval, Payment } from 'mercadopago';
import { envs } from 'src/config';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { PlanService } from 'src/plan/plan.service';
import { PreApprovalResults } from 'mercadopago/dist/clients/preApproval/search/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PaymentService {
    private client: MercadoPagoConfig;

    constructor(
        @Inject(forwardRef(() => PlanService)) private readonly planService: PlanService,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService
    ) {
        this.client = new MercadoPagoConfig({
            accessToken: envs.MERCADOPAGO_ACCESS_TOKEN,
            options: { timeout: 5000, idempotencyKey: 'abc' }
        });
    }

    async newSubscription(createSubscriptionDto: CreateSubscriptionDto, idInToken: string,) {
        const { plan_id } = createSubscriptionDto

        const { plan } = await this.planService.getPlanById(plan_id);
        const user = await this.usersService.getUserById(idInToken);

        if (!user) throw new Error(`User with id ${idInToken} not found`);

        const preApproval = new PreApproval(this.client);
        const results = await preApproval.create({
            body: {
                status: "pending",
                // TODO: Add User Email !!
                payer_email: `test_user_1415234644@testuser.com`,
                back_url: "https://chamoy.lat",
                reason: plan.reason,
                auto_recurring: {
                    frequency: plan.frequency,
                    frequency_type: plan.frequency_type,
                    transaction_amount: plan.transaction_amount,
                    currency_id: plan.currency_id
                },
                external_reference: `${user.inc_id}`,
            }
        });

        return { message: "New Subscription Success", link: results.init_point };
    }


    // @deprecated
    async getActiveSubscriptions() {
        const preApproval = new PreApproval(this.client);
        const results = await preApproval.search({
            options: {
                status: "active"
            }
        });
        return results;
    }

    //Only Get Active Subscriptions
    async getAllSubscriptions() {
        const preApproval = new PreApproval(this.client);
        const LIMIT = 100;
        let offset = 0;
        let resultsArray: PreApprovalResults[] = [];

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        do {
            const results = await preApproval.search({
                options: {
                    status: "authorized",
                    limit: LIMIT,
                    offset: offset
                }
            });

            resultsArray = resultsArray.concat(results.results);

            if (results.results.length < LIMIT) break;

            offset += LIMIT;

            await delay(500);
        } while (true);

        return resultsArray;
    }


    async Reportes() {
        const payment = new Payment(this.client);
        const LIMIT = 100;
        let offset = 0;
        let resultsArray: any[] = [];

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        do {
            const result = await payment.search({
                options: {
                    limit: LIMIT,
                    offset: offset
                }
            });

            resultsArray = resultsArray.concat(result.results);

            if (result.results.length < LIMIT) break;

            offset += LIMIT;

            await delay(500);
        } while (true);
        // return resultsArray
        const resumenPagos = resultsArray.map(pago => ({
            fecha: pago.date_approved,
            cantidad: pago.transaction_amount,
            tipo: pago.point_of_interaction?.type === "SUBSCRIPTIONS" && pago.point_of_interaction?.transaction_data?.subscription_id
                ? "Suscripción"
                : "Compra",
            referencia_externa: pago.external_reference
        }));



        // Agrupar por Mes y Año
        const resumenMensual = resumenPagos.reduce((acc, pago) => {
            if (!pago.fecha) return acc; // Ignorar pagos sin fecha
            if (pago.tipo !== "Suscripción") return acc; // Ignorar pagos de compra

            const fecha = new Date(pago.fecha);
            const mes = fecha.getMonth() + 1; // Meses en JS van de 0 a 11
            const año = fecha.getFullYear();
            const key = `${mes}-${año}`;

            if (!acc[key]) {
                acc[key] = { mes, año, total: 0 };
            }

            acc[key].total += pago.cantidad;
            return acc;
        }, {});

        // Convertir a array
        // return Object.values(resumenMensual);

        // const pagosPorUsuario = resultsArray.reduce((acc, pago) => {
        //     const email = pago.payer?.email || "desconocido";
        //     const cantidad = pago.transaction_amount;
        //     const tipo = pago.point_of_interaction?.type === "SUBSCRIPTIONS" && pago.point_of_interaction?.transaction_data?.subscription_id
        //         ? "Suscripción"
        //         : "Compra";

        //     if (!acc[email]) {
        //         acc[email] = { email, total_pagado: 0, tipos: new Set() };
        //     }

        //     acc[email].total_pagado += cantidad;
        //     acc[email].tipos.add(tipo);

        //     return acc;
        // }, {});

        // // Convertimos los valores del objeto en un array
        
        // return pagosPorUsuario;
        return Object.values(resumenMensual);

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
