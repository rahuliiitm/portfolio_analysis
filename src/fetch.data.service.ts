import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { StockDataService } from './stock.data.service'
import { PortfolioLogger } from './logger/portfolio.logger'

@Injectable()
export class FetchDataService {
  private isDataFetched: boolean = false
  constructor(
    private readonly logger: PortfolioLogger,
    private readonly stockDataService: StockDataService,
  ) {}

  @Cron('0 0 1 * * 5')
  async getWeeklyDataBatch1() {
    if (!this.isDataFetched) {
      const response = await this.stockDataService.fetchStockData(0)
      this.isDataFetched = true
      this.logger.debug(
        `Fetched data for the week with ${response.length} stocks with response ${response}`,
      )
    }
  }

  @Cron('0 0 1 * * 6')
  async getWeeklyDataBatch2() {
    if (this.isDataFetched) {
      const response = await this.stockDataService.fetchStockData(20)
      this.isDataFetched = false
      this.logger.debug(
        `Fetched data for the week with ${response.length} stocks with response ${response}`,
      )
    }
  }

  @Cron('0 0 1 * * 7')
  async getWeeklyDataBatch3() {
    if (!this.isDataFetched) {
      const response = await this.stockDataService.fetchStockData(40)
      this.isDataFetched = true
      this.logger.debug(
        `Fetched data for the week with ${response.length} stocks with response ${response}`,
      )
    }
  }
}
