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
};
