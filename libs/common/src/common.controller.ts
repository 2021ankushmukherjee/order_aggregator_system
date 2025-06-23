import { Controller, Get } from "@nestjs/common";
import { CommonService } from "./common.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('COMMON')
@Controller('common')
export class CommonController {

    constructor(
        private readonly commonService: CommonService
    ) { }
    
    @ApiOperation({ summary: 'Reset system data' })
    @Get('reset')
    resetSystemData(){
        return this.commonService.resetSystemData()
    }
}