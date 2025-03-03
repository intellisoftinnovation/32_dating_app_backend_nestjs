import { HttpException, HttpStatus } from '@nestjs/common';
import { envs } from 'src/config';
import * as twilio from 'twilio';

export const sendSMS = async (phone: string, message: string) => {
    const client = twilio(envs.TWILIO_ACCOUNT_SID, envs.TWILIO_AUTH_TOKEN);

    try {
        const send_status = await client.messages.create(
            {
                body: message,
                from: envs.TWILIO_PHONE_NUMBER,
                to: phone
            }
        )
        return { send_status };
    } catch (err) {
        throw new HttpException({ message: 'We are unable to send messages at this time', details: {...err} }, HttpStatus.SERVICE_UNAVAILABLE);
    }
}