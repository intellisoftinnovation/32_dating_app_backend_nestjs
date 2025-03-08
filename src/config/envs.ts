import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
  DB_URI: string;
  JWTSECRET: string;
  JWTEXPIREIN: string;
  ERRORLOGS: boolean;
  CLOUDINARY_NAME: string;
  CLOUDINARY_KEY: string;
  CLOUDINARY_SECRET: string;
  FACEPLUS_KEY: string;
  FACEPLUS_SECRET: string;
  OTP_TIME: number;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
  MERCADOPAGO_ACCESS_TOKEN: string;
  MERCADOPAGO_SECRET_WEBHOOK_KEY: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_URI: joi.string().required(),
    JWTSECRET: joi.string().required(),
    JWTEXPIREIN: joi.string().required(),
    ERRORLOGS: joi.boolean().required(),
    CLOUDINARY_NAME: joi.string().required(),
    CLOUDINARY_KEY: joi.string().required(),
    CLOUDINARY_SECRET: joi.string().required(),
    FACEPLUS_KEY: joi.string().required(),
    FACEPLUS_SECRET: joi.string().required(),
    OTP_TIME: joi.number().required(),
    TWILIO_ACCOUNT_SID: joi.string().required(),
    TWILIO_AUTH_TOKEN: joi.string().required(),
    TWILIO_PHONE_NUMBER: joi.string().required(),
    MERCADOPAGO_ACCESS_TOKEN: joi.string().required(),
    MERCADOPAGO_SECRET_WEBHOOK_KEY: joi.string().required(),
  })
  .unknown();

const { error, value } = envSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs: Envs = {
  PORT: value.PORT,
  DB_URI: value.DB_URI,
  JWTSECRET: value.JWTSECRET,
  JWTEXPIREIN: value.JWTEXPIREIN,
  ERRORLOGS: value.ERRORLOGS,
  CLOUDINARY_NAME: value.CLOUDINARY_NAME,
  CLOUDINARY_KEY: value.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: value.CLOUDINARY_SECRET,
  FACEPLUS_KEY: value.FACEPLUS_KEY,
  FACEPLUS_SECRET: value.FACEPLUS_SECRET,
  OTP_TIME: value.OTP_TIME,
  TWILIO_ACCOUNT_SID: value.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: value.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: value.TWILIO_PHONE_NUMBER,
  MERCADOPAGO_ACCESS_TOKEN: value.MERCADOPAGO_ACCESS_TOKEN,
  MERCADOPAGO_SECRET_WEBHOOK_KEY: value.MERCADOPAGO_SECRET_WEBHOOK_KEY,
};
