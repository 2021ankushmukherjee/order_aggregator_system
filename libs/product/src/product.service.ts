import { ProductEntity } from '@app/database/entities/product.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    ) { }

    async getProducts() {
        return await this.productRepository.find();
    }
}
