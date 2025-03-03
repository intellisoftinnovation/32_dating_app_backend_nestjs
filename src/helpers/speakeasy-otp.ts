import * as speakeasy from 'speakeasy';
import * as crypto from 'crypto';
import * as base32 from 'thirty-two';
import { envs } from 'src/config';

const digits = 4 ; // Número de dígitos del código 

const generateSecretFromObject = (data: object): string => {
    const appSecret = process.env.JWTSECRET; // Clave secreta de la app
    const rawData = JSON.stringify(data); // Convertir objeto a string
    const hmac = crypto.createHmac('sha256', appSecret).update(rawData).digest(); // Generamos el hash

    return base32.encode(hmac).toString(); // Convertir el buffer a Base32
};

// Método para generar un OTP basado en un objeto
export const generateOTP = (data: object): string => {
    const secret = generateSecretFromObject(data);
    return speakeasy.totp({
        secret,
        encoding: 'base32',
        digits, 
        step: envs.OTP_TIME, // Duración en segundos
    });
}

// Método para verificar un OTP basado en un objeto
export const verifyOTP = (data: object, token: string): boolean => {
    const secret = generateSecretFromObject(data);
    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        digits, 
        step: envs.OTP_TIME,
        window: 1, // Permite margen de tiempo para tolerancia
    });
}
