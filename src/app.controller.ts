import { Body, Controller, Get, Optional, Param, Query } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('v1/portfolio')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('latest')
  async getLatestStockData(): Promise<any> {
    const response = await this.appService.getLatestStockData()
    return {
      data: response,
      count: response.length,
    }
  }

  @Get('trend/change')
  async getStockList(@Query('downtrend') downtrend: string): Promise<any> {
    const isTrendDown: boolean = downtrend === 'true'
    const response = await this.appService.getTrendChangeStocks(isTrendDown)
    return {
      data: response,
      count: response.length,
    }
  }

  @Get('trending')
  async getTrendingStocks(@Query('uptrend') uptrend: string): Promise<any> {
    const isTrendUp: boolean = uptrend === 'true'
    const response = await this.appService.getTrendingStocks(isTrendUp)
    return {
      data: response,
      count: response.length,
    }
  }
}
