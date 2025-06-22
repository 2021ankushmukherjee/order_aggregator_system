import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { InitialService } from './initial.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@app/database/entities/product.entity';
import { VendorStockEntity } from '@app/database/entities/vendor-stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, VendorStockEntity]),
  ],
  providers: [CommonService, InitialService],
  exports: [CommonService],
})
export class CommonModule { }
