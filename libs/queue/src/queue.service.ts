import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class QueueService implements OnModuleInit {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    async onModuleInit() {
        try {
            const url = process.env.RABBITMQ_URL || 'amqp://order-rabbitmq:5672';
            this.connection = await this.connectWithRetry(url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue('order_queue');
            console.log('QueueService initialized');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async publishOrder(order: any): Promise<void> {
        try {

            if (!this.channel) throw new Error('RabbitMQ channel not initialized');

            const payload = Buffer.from(JSON.stringify(order));
            this.channel.sendToQueue('order_queue', payload);
            console.log('Order published to queue:', order.id);

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private async connectWithRetry(url: string, retries = 10, delay = 3000): Promise<amqp.Connection> {
        try {

            for (let i = 0; i < retries; i++) {
                try {
                    console.log(`RabbitMQ Connect Attempt ${i + 1}/${retries}`);
                    const conn = await amqp.connect(url);
                    console.log('Connected to RabbitMQ');
                    return conn;
                } catch (err) {
                    console.warn(`Connection failed: ${err.message}`);
                    if (i === retries - 1) throw err;
                    await new Promise((res) => setTimeout(res, delay));
                }
            }
            throw new Error('RabbitMQ connection failed');

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
