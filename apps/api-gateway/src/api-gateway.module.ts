import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { OrderModule } from '@app/order';
import { VendorModule } from '@app/vendor';
import { DatabaseModule } from '@app/database';

@Module({
    imports: [OrderModule, VendorModule, DatabaseModule],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
