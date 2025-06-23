import { Module } from '@nestjs/common';
import { OrderModule } from '@app/order';
import { VendorModule } from '@app/vendor';
import { DatabaseModule } from '@app/database';
import { QueueModule } from '@app/queue';
import { CommonModule } from '@app/common';
import { ProductModule } from '@app/product';

@Module({
  imports: [
    ProductModule,
    OrderModule,
    VendorModule,
    DatabaseModule,
    QueueModule,
    CommonModule,
  ],
})
export class ApiGatewayModule { }
