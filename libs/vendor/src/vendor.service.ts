import { ProductEntity } from '@app/database/entities/product.entity';
import { StockEntity } from '@app/database/entities/stock.entity';
import { VendorStockEntity } from '@app/database/entities/vendor-stock.entity';
import { BadGatewayException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(VendorStockEntity) private readonly vendorStockRepository: Repository<VendorStockEntity>,
        @InjectRepository(StockEntity) private readonly stockRepository: Repository<StockEntity>,
        @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    ) { }

    async syncStockFromVendors() {

        try {

            const vendorStocks = await this.vendorStockRepository.find();

            const productStockMap = new Map<string, number>();

            for (const stock of vendorStocks) {
                const current = productStockMap.get(stock.productId) || 0;
                productStockMap.set(stock.productId, current + stock.quantity);
            }

            const updates: any = [];

            for (const [productId, totalQuantity] of productStockMap.entries()) {
                const existing = await this.stockRepository.findOneBy({ productId });

                if (existing) {
                    existing.quantity = totalQuantity;
                    updates.push(this.stockRepository.save(existing));
                } else {
                    const newStock = this.stockRepository.create({ productId, quantity: totalQuantity });
                    updates.push(this.stockRepository.save(newStock));
                }
            }

            await Promise.all(updates);

            return { message: 'Stock synced successfully', httpStatus: HttpStatus.OK };

        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async getVendorStock() {
        const [vendorStocks, allProducts] = await Promise.all([
            this.vendorStockRepository.find(),
            this.productRepository.find(),
        ]);

        const productMap = new Map<string, string>();
        for (const product of allProducts) {
            productMap.set(product.id, product.name);
        }

        const response: Record<string, { product: string; quantity: number }[]> = {};

        for (const stock of vendorStocks) {
            const vendor = stock.vendor;
            const productName = productMap.get(stock.productId) || `Product ${stock.productId}`;

            if (!response[vendor]) {
                response[vendor] = [];
            }

            response[vendor].push({
                product: productName,
                quantity: stock.quantity,
            });
        }

        return response;
    }
    async getVendorStockByVendor(vendor: string) {
        try {

            if (!vendor) {
                throw new BadGatewayException('Vendor is required');
            }
            const vendorStocks = await this.vendorStockRepository.find({ where: { vendor } });

            console.log(vendorStocks);

            if (!vendorStocks.length || vendorStocks.length === 0) {
                throw new NotFoundException(`No stock found for vendor '${vendor}'`);
            }

            const allProducts = await this.productRepository.find();

            const productMap = new Map<string, string>();
            for (const product of allProducts) {
                productMap.set(product.id, product.name);
            }

            const grouped = new Map<string, number>();
            for (const stock of vendorStocks) {
                grouped.set(stock.productId, (grouped.get(stock.productId) || 0) + stock.quantity);
            }

            const stockList = Array.from(grouped.entries()).map(([productId, quantity]) => ({
                product: productMap.get(productId) || `Product ${productId}`,
                quantity,
            }));

            return {
                vendor,
                stock: stockList,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error fetching vendor stock:', error);
            throw new InternalServerErrorException('Failed to retrieve vendor stock');
        }
    }



}
