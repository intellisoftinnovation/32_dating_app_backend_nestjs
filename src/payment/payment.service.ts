import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval, Payment } from 'mercadopago';
import { envs } from 'src/config';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { PlanService } from 'src/plan/plan.service';
import { PreApprovalResults } from 'mercadopago/dist/clients/preApproval/search/types';
import { UsersService } from 'src/users/users.service';
import { AutoRecurringWithFreeTrial } from 'mercadopago/dist/clients/preApproval/commonTypes';
import { PreApprovalUpdateResponse } from 'mercadopago/dist/clients/preApproval/update/types';


export interface GetSubcriptionResult {
    subscription: PreApprovalResults;
    expirationDate: Date;
    years: number;
    months: number;
    days: number
}

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
                // TBD: Add User Email !!
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
                    offset: offset, 
                    order: "date_created:desc"
                }
            });

            resultsArray = resultsArray.concat(results.results);

            if (results.results.length == 0) break;

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
                    limit: LIMIT,
                    offset: offset, 
                    sort: "date_created:desc"
                }
            });

            // console.log(results);
            resultsArray = resultsArray.concat(results.results);

            results.results.forEach(element => {
                if (element.external_reference.toString() === idInToken) {
                    const { days, months, years } = this.calculateRemainingTime(this.calculateExpirationDate(element.next_payment_date, element.date_created, element.auto_recurring));
                    if (element.status === "authorized" || ((days || months || years) && element.status === 'cancelled')) {
                        premium = true;
                    }
                }
            });

            if (results.results.length ==0) break;

            offset += LIMIT;

            if (!premium) await delay(500);
            // console.log(`Fetching next ${LIMIT} results...`);
        } while (!premium);

        return premium;
    }

    async getSubscription(idInToken: string) {
        const preApproval = new PreApproval(this.client);
        const LIMIT = 100;
        let offset = 0;
        // let it =  0 ; 
        let premium = false;
        let resultsArray: any[] = [];
        const subscription: GetSubcriptionResult[] = [];
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const user = await this.usersService.getUserById(idInToken);
        do {
            const results = await preApproval.search({
                options: {
                    // status: "authorized",
                    limit: LIMIT,
                    offset: offset,
                    sort: "date_created:desc"
                }
            });

            // console.log(results);
            resultsArray = resultsArray.concat(results.results);

            results.results.forEach(element => {
                if (element.external_reference.toString() === user.inc_id) {
                    const { days, months, years } = this.calculateRemainingTime(this.calculateExpirationDate(element.next_payment_date, element.date_created, element.auto_recurring));
                    const expirationDate = this.calculateExpirationDate(
                        element.next_payment_date,
                        element.date_created,
                        element.auto_recurring,
                    );
                    if (element.status === "authorized" || ((days || months || years) && element.status === 'cancelled')) {
                        subscription.push({ subscription: element, days, months, years, expirationDate });
                        premium = true;
                    }
                }
            });

            if (results.results.length == 0) {
                // console.log("No results")
                break
            };

            offset += LIMIT;

            if (!premium) await delay(500);
            // console.log(`Fetching next ${LIMIT} results...`);
        } while (!premium);
        // console.log("\n\n#End\n\n")
        if (!premium) {
            return { message: "No Subscription Found", subscription: null };
        } else {
            return { message: "Subscription Found", subscription };
        }
    }

    async subscribeHook(data: any) {
        console.log(data);
    }


    async cancelSubscription(id_subscription: string) {
        try {
            const preApproval = new PreApproval(this.client);
            const results: PreApprovalUpdateResponse = await preApproval.update({
                id: id_subscription,
                body: {
                    status: "cancelled",
                },
            });

            return { message: "Subscription Cancelled", id: results.id };
        } catch (error) {
            console.log(error);
            throw new HttpException({ message: 'No podemos cancelar su subscripción en este momento', error }, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }


    private calculateExpirationDate(
        nextPaymentDate: number | undefined,
        dateCreated: number | undefined,
        autoRecurring: AutoRecurringWithFreeTrial | undefined,
    ): Date | null {
        if (nextPaymentDate) {
            return new Date(nextPaymentDate);
        }

        if (dateCreated && autoRecurring) {
            const startDate = new Date(dateCreated);
            const { frequency, frequency_type } = autoRecurring;

            switch (frequency_type) {
                case "months":
                    return new Date(startDate.getFullYear(), startDate.getMonth() + frequency, startDate.getDate());
                case "days":
                    return new Date(startDate.getTime() + frequency * 24 * 60 * 60 * 1000);
                case "years":
                    return new Date(startDate.getFullYear() + frequency, startDate.getMonth(), startDate.getDate());
                default:
                    console.warn(`Tipo de frecuencia desconocido: ${frequency_type}`);
                    return null;
            }
        }

        return null;
    }

    private calculateRemainingTime(expirationDate: Date | null): { years: number; months: number; days: number } | null {
        // console.log(expirationDate)
        if (!expirationDate) return null;

        const now = new Date();
        const diffMs = expirationDate.getTime() - now.getTime();
        const diffDays = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0);

        const sol = {
            years: Math.floor(diffDays / 365),
            months: Math.floor((diffDays % 365) / 30),
            days: diffDays % 30,
        };
        // console.log(expirationDate, sol)
        return sol
    }

}
