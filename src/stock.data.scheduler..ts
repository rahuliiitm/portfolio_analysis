import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { StockDataService } from './stock.data.service'
import { PortfolioLogger } from './logger/portfolio.logger'

@Injectable()
export class StockDataScheduler {
  constructor(
    private readonly logger: PortfolioLogger,
    private readonly stockDataService: StockDataService,
  ) {}

  //@Cron('45 * * * * *')
  @Cron('0 0 1 * * 1-7')
  async getWeeklyDataBatch1() {
    const response = await this.stockDataService.fetchStockData()
    this.logger.debug(`Fetched data at ${new Date()} for the day`)
  }

  // @Cron('0 0 1 * * 6')
  // async getWeeklyDataBatch2() {
  //   if (this.isDataFetched) {
  //     const response = await this.stockDataService.fetchStockData(20)
  //     this.isDataFetched = false
  //     this.logger.debug(
  //       `Fetched data for batch 2 for the week with ${response.length} stocks with response ${response}`,
  //     )
  //   }
  // }

  // @Cron('0 0 1 * * 7')
  // async getWeeklyDataBatch3() {
  //   if (!this.isDataFetched) {
  //     const response = await this.stockDataService.fetchStockData(40)
  //     this.isDataFetched = true
  //     this.logger.debug(
  //       `Fetched data for batch 3 for the week with ${response.length} stocks with response ${response}`,
  //     )
  //   }
  // }
}
