import { getConfig } from "../utils/index.ts";

export const CONFIG = {
    MONGO_URI: getConfig('MONGO_URI', 'mongodb://localhost:27017/users'),
    RABBITMQ_URL: getConfig('RABBITMQ_URL', 'amqp://localhost:5672'),
    PORT: getConfig('PORT', 4000),
    EXCHANGE_NAME: 'websocket_exchange',
};
