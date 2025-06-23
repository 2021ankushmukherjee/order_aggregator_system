import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('ORDER')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @ApiOperation({ summary: 'Create a new order' })
    @Post('create')
    async create(@Body() body: CreateOrderRequestDto) {
        return this.orderService.create(body);
    }

    @ApiOperation({ summary: 'Get all orders' })
    @Get('all')
    async get() {
        return this.orderService.getOrders();
    }
}
