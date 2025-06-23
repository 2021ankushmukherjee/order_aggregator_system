import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { ApiOperation } from '@nestjs/swagger';


@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @ApiOperation({ summary: 'Create a new order' })
    @Post('create')
    async create(@Body() body: CreateOrderRequestDto) {
        return this.orderService.create(body);
    }

    @ApiOperation({ summary: 'Get all orders' })
    @Post('all')
    async get() {
        return this.orderService.getOrders();
    }
}
