import { ProductEntity } from '@app/database/entities/product.entity';
import { StockEntity } from '@app/database/entities/stock.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(StockEntity) private readonly stockRepository: Repository<StockEntity>,
    ) { }

    async getProductsWithStock() {
        try {

            const products = await this.productRepository.find();
            const stockEntries = await this.stockRepository.find();

            const stockMap = new Map<string, number>();

            for (const stock of stockEntries) {
                stockMap.set(stock.productId, stock.quantity);
            }

            const result = products.map((product) => ({
                id: product.id,
                name: product.name,
                description: product.description,
                quantity: stockMap.get(product.id) || 0,
            }));

            return result;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}
