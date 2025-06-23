import { Controller, Get, Param, Post } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('vendor')
export class MockVendorController {
    constructor(private readonly vendorService: VendorService) { }
    
    @ApiOperation({ summary: 'Sync stock from vendors' })
    @Post('stock/sync')
    async sync() {
        return this.vendorService.syncStockFromVendors();
    }
    
    @ApiOperation({ summary: 'Fetch stocks of all vendors' })
    @Get('stocks')
    async get() {
        return this.vendorService.getVendorStock();
    }
   
    @ApiOperation({ summary: 'Fetch stock by vendor' })
    @Get(':vendor/stock')
    @ApiParam({ name: 'vendor' })
    async getByVendor(@Param('vendor') vendor: string) {
        return this.vendorService.getVendorStockByVendor(vendor);
    }
}
