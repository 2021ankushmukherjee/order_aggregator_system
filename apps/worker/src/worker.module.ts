import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { QueueModule } from '@app/queue';
import { OrderModule } from '@app/order';
import { DatabaseModule } from '@app/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@app/database/entities/order.entity';
import { StockEntity } from '@app/database/entities/stock.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, StockEntity]),
    DatabaseModule,
    OrderModule,
    QueueModule,
  ],
  providers: [WorkerService],
})
export class WorkerModule { }
