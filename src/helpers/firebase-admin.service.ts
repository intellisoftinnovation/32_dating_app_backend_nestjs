import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import  serviceAccount from '../../chamoy-cd4a7-974da795891b.json';

@Injectable()
export class FirebaseAdminService {
    constructor() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            });
        }
    }

    async sendNotificationToDevice(token: string, payload: { title: string; body: string }) {
        const message: admin.messaging.Message = {
            token,
            notification: {
                title: payload.title,
                body: payload.body,
            },
        };

        return await admin.messaging().send(message);
    }
}
