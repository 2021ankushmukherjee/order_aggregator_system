import { Controller, Get } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiOperation } from "@nestjs/swagger";


@Controller('product')
export class ProductController {

    constructor(
        private readonly productService: ProductService
    ) { }

    @ApiOperation({ summary: 'Fetch all products' })
    @Get('all')
    getProducts() {
        return this.productService.getProducts();
    }
}