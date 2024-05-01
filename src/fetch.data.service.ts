import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import { Logger } from 'nestjs-pino'
import { StockDataService } from './stock.data.service'
import { PortfolioLogger } from './logger/portfolio.logger'

@Injectable()
export class FetchDataService {
  private isDataFetched: boolean = false
  constructor(
    private readonly logger: PortfolioLogger,
    private readonly configService: ConfigService,
    private readonly stockDataService: StockDataService,
  ) {}

  // @Cron('0 */30 9-17 * * *')
  @Cron('45 * * * * *')
  async getWeeklyData() {
    if (!this.isDataFetched) {
      const response = await this.stockDataService.fetchStockData()
      this.isDataFetched = true
      this.logger.debug(
        `Fetched data for the week with ${response.length} stocks with response ${response}`,
      )
    }
    this.logger.debug('Called every 45 seconds')
  }
}
