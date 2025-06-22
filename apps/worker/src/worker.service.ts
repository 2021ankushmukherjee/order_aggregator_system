import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { StockEntity } from '@app/database/entities/stock.entity';
import { OrderEntity, OrderStatus } from '@app/database/entities/order.entity';
import { VendorStockEntity } from '@app/database/entities/vendor-stock.entity';
import { IServiceFunctionOptions } from '@app/common/query-runner.service';

@Injectable()
export class WorkerService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(StockEntity) private readonly stockRepository: Repository<StockEntity>,
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(VendorStockEntity) private readonly vendorStockRepository: Repository<VendorStockEntity>,
  ) { }

  async onModuleInit() {
    try {

      const conn = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await conn.createChannel();
      await channel.assertQueue('order_queue');

      channel.consume('order_queue', async (msg) => {
        if (!msg) return;

        const orderData = JSON.parse(msg.content.toString());

        console.log(`Order ${orderData.id} received for product ${orderData.productId}`);

        try {
          await this.processOrder(orderData);
          channel.ack(msg);
          console.log(`Order ${orderData.id} processed.`);
        } catch (err) {
          console.error(`Error processing order ${orderData.id}:`, err.message);
          channel.nack(msg, false, true); // Requeue
        }
      });

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async processOrder(orderData: any, options?: IServiceFunctionOptions) {
    let dbTransaction: QueryRunner, commitTransaction: boolean;
    if (options?.queryRunner) {
      commitTransaction = false;
      dbTransaction = options?.queryRunner;
    } else {
      commitTransaction = true;
      dbTransaction = this.dataSource.createQueryRunner();
      await dbTransaction.connect();
      await dbTransaction.startTransaction();
    }
    try {

      const order = await this.orderRepository.findOne({ where: { id: orderData.id } });

      if (!order) {
        throw new Error('Order not found');
      }

      const vendorStocks = await this.vendorStockRepository.find({
        where: { productId: order.productId },
        order: { quantity: 'DESC' },
      });

      if (!vendorStocks || vendorStocks.length === 0) {
        throw new Error('No vendor has stock for this product');
      }

      const totalStock = vendorStocks.reduce((acc, vs) => acc + vs.quantity, 0);

      if (totalStock < order.quantity) {
        throw new Error('Insufficient total stock across all vendors');
      }

      let remainingQty = order.quantity;
      const vendorsUsed: string[] = [];

      for (const vendor of vendorStocks) {
        if (remainingQty <= 0) break;

        const deductQty = Math.min(vendor.quantity, remainingQty);
        vendor.quantity -= deductQty;
        remainingQty -= deductQty;
        vendorsUsed.push(`${vendor.vendor}(-${deductQty})`);

        await dbTransaction.manager.save(vendor);
      }

      order.status = OrderStatus.SUCCESS;
      await dbTransaction.manager.save(order);


      if (commitTransaction) {
        await dbTransaction.commitTransaction();
      }

      console.log(
        `✅ Order ${order.id} for product ${order.productId} fulfilled from vendors: ${vendorsUsed.join(', ')}`
      );


    } catch (error) {
      console.error(error);
      if (commitTransaction) {
        await dbTransaction.rollbackTransaction();
      }
      throw error;
    } finally {
      if (commitTransaction) {
        await dbTransaction.release();
      }
    }
  }

}
