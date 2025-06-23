import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@app/database/entities/product.entity';
import { ProductController } from './product.controller';
import { StockEntity } from '@app/database/entities/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, StockEntity]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
