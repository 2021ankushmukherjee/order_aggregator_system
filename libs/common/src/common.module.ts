import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { InitialService } from './initial.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@app/database/entities/product.entity';
import { VendorStockEntity } from '@app/database/entities/vendor-stock.entity';
import { OrderEntity } from '@app/database/entities/order.entity';
import { DatabaseModule } from '@app/database';
import { StockEntity } from '@app/database/entities/stock.entity';
import { CommonController } from './common.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, VendorStockEntity, OrderEntity, StockEntity]),
    DatabaseModule
  ],
  controllers: [CommonController],
  providers: [CommonService, InitialService],
  exports: [CommonService],
})
export class CommonModule { }
