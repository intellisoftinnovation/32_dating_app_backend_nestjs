import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
  DB_URI: string;
  JWTSECRET: string;
  JWTEXPIREIN: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_URI: joi.string().required(),
    JWTSECRET: joi.string().required(),
    JWTEXPIREIN: joi.string().required(),
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
};
