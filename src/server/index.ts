import express from 'express';
import { createServer } from 'http';

import { CONFIG } from '../config/index.ts';
import { connectToMongoDB } from '../database/mongodb.ts';
import { setupRabbitMQ } from '../messaging/rabbitmq.ts';
import { setupWebSocketServer } from './websocket.ts';
import router from '../routes/index.ts';

export async function startServer() {
    const app = express();
    const server = createServer(app);

    await connectToMongoDB();

    const { channel } = await setupRabbitMQ();
    setupWebSocketServer(server, channel, CONFIG.EXCHANGE_NAME);

    app.use(router)

    server.listen(CONFIG.PORT, () => {
        console.log(`Server is running on port ${CONFIG.PORT} (PID: ${process.pid})`);
    });
}
