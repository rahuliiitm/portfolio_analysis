import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { StockDataEntity } from './stock.data.entity'
import { StockDataModel } from '../model/stock.data.model'
import { StockDataMapper } from '../mapper/stock.data.mapper'
import { DataFrequency } from '../model/data.frequency.enum'
import { PortfolioLogger } from '../logger/portfolio.logger'

@Injectable()
export class StockDataRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mapper: StockDataMapper,
    private readonly logger: PortfolioLogger,
  ) {}

  async saveStockData(stockData: StockDataModel[]) {
    try {
      const stockDataEntities = this.mapper.toStockDataEntity(stockData, DataFrequency.WEEKLY)
      return await this.dataSource.getRepository(StockDataEntity).upsert(stockDataEntities, {
        conflictPaths: ['stockSymbol', 'period', 'frequency'],
      })
    } catch (error) {
      this.logger.error(`Error saving stock data with error ${error}`)
    }
  }
}
