import amqplib, { type Channel, type Connection } from 'amqplib';
import { WebSocketServer } from 'ws';

import { CONFIG } from '../config/index.ts';

export async function setupRabbitMQ(): Promise<{ connection: Connection; channel: Channel }> {
    try {
        const connection: Connection = await amqplib.connect(CONFIG.RABBITMQ_URL);
        const channel: Channel = await connection.createChannel();

        await channel.assertExchange(CONFIG.EXCHANGE_NAME, 'fanout', { durable: false });
        console.log('RabbitMQ setup completed.');
        return { connection, channel };
    } catch (error) {
        console.error('Error setting up RabbitMQ:', error);
        throw error;
    }
}

export async function consumeRabbitMQMessages(
    channel: Channel,
    exchangeName: string,
    wss: WebSocketServer
) {
    try {
        // Geçici bir kuyruk oluştur
        const queue = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(queue.queue, exchangeName, '');

        // Mesajları tüket
        channel.consume(queue.queue, (msg) => {
            if (msg) {
                const receivedMessage = msg.content.toString();
                console.log(`Received message from RabbitMQ: ${receivedMessage}`);

                // Tüm WebSocket istemcilerine mesaj gönder
                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN) {
                        client.send(receivedMessage);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error setting up RabbitMQ consumer:', error);
    }
}