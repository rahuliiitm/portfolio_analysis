import { Injectable } from '@nestjs/common'
import { StockDataRepository } from './dal/stock.data.repository'

@Injectable()
export class AppService {
  constructor(private readonly stockDataRepository: StockDataRepository) {}
  getHello(): string {
    return 'Hello World!'
  }

  async getLatestStockData(): Promise<any> {
    return await this.stockDataRepository.getLatestStockData()
  }

  async getTrendChangeStocks(isTrendChangeDown: boolean): Promise<any> {
    return await this.stockDataRepository.getTrendChangeStocks(isTrendChangeDown)
  }

  async getTrendingStocks(isTrendUp: boolean): Promise<any> {
    return await this.stockDataRepository.getTrendingStocks(isTrendUp)
  }
}
