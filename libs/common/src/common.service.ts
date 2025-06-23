import { OrderEntity } from '@app/database/entities/order.entity';
import { ProductEntity } from '@app/database/entities/product.entity';
import { StockEntity } from '@app/database/entities/stock.entity';
import { VendorStockEntity } from '@app/database/entities/vendor-stock.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { IServiceFunctionOptions } from './query-runner.service';

@Injectable()
export class CommonService {

    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(StockEntity) private readonly stockRepository: Repository<StockEntity>,
        @InjectRepository(VendorStockEntity) private readonly vendorStockRepository: Repository<VendorStockEntity>,
        @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,

    ) { }


    async resetSystemData(options?: IServiceFunctionOptions) {
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

            await dbTransaction.manager.clear(OrderEntity);


            const allVendorStocks = await this.vendorStockRepository.find();
            for (const vendorStock of allVendorStocks) {
                vendorStock.quantity = 100;
                await dbTransaction.manager.save(VendorStockEntity, vendorStock);
            }


            await dbTransaction.manager.clear(StockEntity);


            const allProducts = await this.productRepository.find();
            const newStocks = allProducts.map((product) =>
                dbTransaction.manager.create(StockEntity, {
                    productId: product.id,
                    quantity: 0,
                }),
            );
            await dbTransaction.manager.save(StockEntity, newStocks);


            if (commitTransaction) {
                await dbTransaction.commitTransaction();
            }

            return { message: 'System data reset successfully', httpStatus: HttpStatus.OK };

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

