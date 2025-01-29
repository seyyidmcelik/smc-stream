import { type Server } from 'node:http';
import { type Channel } from 'amqplib';
import { WebSocketServer } from 'ws';

import { consumeRabbitMQMessages } from '../messaging/rabbitmq.ts';

export function setupWebSocketServer(server: Server, channel: Channel, exchangeName: string) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws, req) => {
        console.log('WebSocket connection established.');

        const clientIP = req.socket.remoteAddress || 'Unknown IP';
        console.log(`New client connected. IP: ${clientIP}`);

        ws.on('message', async (message) => {
            console.log(`Received message: ${message}`);
            channel.publish(exchangeName, '', Buffer.from(message.toString()));
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed.');
        });
    });

    consumeRabbitMQMessages(channel, exchangeName, wss);

    return wss;
}
