import { Controller, Get, Param, Post } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('vendor')
export class MockVendorController {
    constructor(private readonly vendorService: VendorService) { }

    @Post('stock/sync')
    async sync() {
        return this.vendorService.syncStockFromVendors();
    }

    @Get('stock')
    async get() {
        return this.vendorService.getVendorStock();
    }

    @Get(':vendor/stock')
    @ApiParam({ name: 'vendor' })
    async getByVendor(@Param('vendor') vendor: string) {
        return this.vendorService.getVendorStockByVendor(vendor);
    }
}
