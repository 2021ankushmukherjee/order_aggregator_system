import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { StockEntity } from '@app/database/entities/stock.entity';
import { OrderEntity } from '@app/database/entities/order.entity';
import { QueueService } from '@app/queue';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { IServiceFunctionOptions } from '@app/common/query-runner.service';

@Injectable()
export class OrderService {
    constructor(
        private dataSource: DataSource,
        private readonly queueService: QueueService,
        @InjectRepository(StockEntity) private stockRepository: Repository<StockEntity>,
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    ) { }

    async create(dto: CreateOrderRequestDto, options?: IServiceFunctionOptions) {
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

            const stock = await this.stockRepository.findOne({
                where: { productId: dto.productId },
            });


            if (!stock || stock.quantity < dto.quantity) {
                throw new Error('Insufficient stock');
            }

            stock.quantity -= dto.quantity;
            await dbTransaction.manager.save(stock);

            const order = dbTransaction.manager.create(OrderEntity, dto);
            await dbTransaction.manager.save(order);

            await this.queueService.publishOrder(order);

            if (commitTransaction) {
                await dbTransaction.commitTransaction();
            }

            return { success: true, orderId: order.id };


        } catch (error) {
            console.log(error);
            if (commitTransaction) {
                await dbTransaction.rollbackTransaction();
            }
            throw error;
        } finally {
            if (dbTransaction) {
                await dbTransaction.release();
            }
        }

    }


    async getOrders() {
        return await this.orderRepository.find();
    }
}
