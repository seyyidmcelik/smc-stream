import { getConfig } from "../utils/index.ts";

export const CONFIG = {
    PORT: getConfig('PORT'),
    MONGO_URI: getConfig('MONGO_URI'),
    RABBITMQ_URL: getConfig('RABBITMQ_URL'),
    EXCHANGE_NAME: getConfig('EXCHANGE_NAME'),
    JWT_SECRET_ACCESS: getConfig('JWT_SECRET_ACCESS'),
    JWT_SECRET_REFRESH: getConfig('JWT_SECRET_REFRESH'),
    JWT_EXPIRES_IN: getConfig('JWT_EXPIRES_IN'),
    COOKIE_SECURE: getConfig('COOKIE_SECURE'),
    CLIENT_URL: getConfig('CLIENT_URL')
};