import { ProductEntity } from "@app/database/entities/product.entity";
import { Inject, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { products, vendors } from "./seeds/seeds";
import { VendorStockEntity } from "@app/database/entities/vendor-stock.entity";




export class InitialService implements OnModuleInit {

    constructor(
        @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(VendorStockEntity) private readonly vendorStockRepository: Repository<VendorStockEntity>,
    ) { }

    async onModuleInit() {
        await this.createMockProduct();
        await this.createVendorStock();
    }


    private async createMockProduct() {
        try {
            const newProduct: ProductEntity[] = [];

            for (const product of products) {

                const isProduct = await this.productRepository.findOne({ where: { name: product } });
                if (isProduct) continue;

                newProduct.push(this.productRepository.create({
                    name: product,
                    description: `This is ${product}`,
                }));
            }

            if (newProduct.length > 0) {
                await this.productRepository.save(newProduct);
            }

            console.log('✅ Mock products created');

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private async createVendorStock() {
        try {
            const products = await this.productRepository.find();
            const existingStocks = await this.vendorStockRepository.find();

            const existingMap = new Set(
                existingStocks.map(stock => `${stock.vendor}_${stock.productId}`)
            );

            const newStocks: VendorStockEntity[] = [];

            for (const vendor of vendors) {
                for (const product of products) {
                    const key = `${vendor}_${product.id}`;
                    if (existingMap.has(key)) continue;

                    newStocks.push(
                        this.vendorStockRepository.create({
                            vendor,
                            productId: product.id,
                            quantity: 100,
                        }),
                    );
                }
            }

            if (newStocks.length > 0) {
                await this.vendorStockRepository.save(newStocks);
            }

            console.log('✅ Vendor stock created for each product and vendor');

        } catch (error) {
            console.error('❌ Error creating vendor stock:', error);
            throw error;
        }
    }

}