import { Controller, Get } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('PRODUCT')
@Controller('product')
export class ProductController {

    constructor(
        private readonly productService: ProductService
    ) { }

    @ApiOperation({ summary: 'Fetch all products with stock' })
    @Get('all')
    getProducts() {
        return this.productService.getProductsWithStock();
    }
}