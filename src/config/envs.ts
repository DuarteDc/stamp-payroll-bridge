/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DB_HOST: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_SID: string;
  DB_PORT: number;
  DB_SYNCHRONIZE: boolean;
  DB_SCHEMA: string;
  SAT_RECEPTION_WSDL: string;
  SAT_CONSULTATION_WSDL: string;
  SAT_CANCELATION_WSDL: string;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().default(3000),
    DB_HOST: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_SID: joi.string().required(),
    DB_PORT: joi.number().default(1521),
    DB_SYNCHRONIZE: joi.boolean().default(true),
    DB_SCHEMA: joi.string().required(),
    SAT_RECEPTION_WSDL: joi.string().uri(),
    SAT_CONSULTATION_WSDL: joi.string().uri(),
    SAT_CANCELATION_WSDL: joi.string().uri(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  dbHost: envVars.DB_HOST,
  dbUsername: envVars.DB_SCHEMA,
  dbPassword: envVars.DB_PASSWORD,
  dbSid: envVars.DB_SID,
  dbPort: envVars.DB_PORT,
  dbSynchronize: envVars.DB_SYNCHRONIZE,
  dbSchema: envVars.DB_SCHEMA,
  satReceptionWsdl: envVars.SAT_RECEPTION_WSDL,
  satConsultationWsdl: envVars.SAT_CONSULTATION_WSDL,
  satCancelationWsdl: envVars.SAT_CANCELATION_WSDL,
};
