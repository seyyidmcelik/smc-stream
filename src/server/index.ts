import express from 'express';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { CONFIG } from '../config/index.ts';
import { connectToMongoDB } from '../database/mongodb.ts';
import { setupRabbitMQ } from '../messaging/rabbitmq.ts';
import { setupWebSocketServer } from './websocket.ts';
import { handleErrors } from '../utils/index.ts';
import authRoutes from '../routes/authRoutes.ts';

export async function startServer() {
    const app = express();
    const server = createServer(app);

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

    await connectToMongoDB();

    app.use('/api/auth', authRoutes);

    app.use(handleErrors);

    const { channel } = await setupRabbitMQ();
    setupWebSocketServer(server, channel, CONFIG.EXCHANGE_NAME);


    server.listen(CONFIG.PORT, () => {
        console.log(`Server is running on port ${CONFIG.PORT} (PID: ${process.pid})`);
    });
}
