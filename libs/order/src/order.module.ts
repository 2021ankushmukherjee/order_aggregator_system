import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from '@app/database/entities/stock.entity';
import { OrderEntity } from '@app/database/entities/order.entity';
import { QueueModule } from '@app/queue';


@Module({
  imports: [TypeOrmModule.forFeature([StockEntity, OrderEntity]), QueueModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
