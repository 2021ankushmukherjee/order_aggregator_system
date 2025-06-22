import { Module, } from '@nestjs/common';
import { VendorService } from './vendor.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from '@app/database/entities/stock.entity';
import { MockVendorController } from './mock-vendor.controller';
import { VendorStockEntity } from '@app/database/entities/vendor-stock.entity';
import { ProductEntity } from '@app/database/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity, VendorStockEntity, ProductEntity])],
  controllers: [MockVendorController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule { }
