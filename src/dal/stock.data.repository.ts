import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { StockDataEntity } from './stock.data.entity'
import { StockDataModel } from '../model/stock.data.model'
import { StockDataMapper } from '../mapper/stock.data.mapper'
import { DataFrequency } from '../model/data.frequency.enum'
import { PortfolioLogger } from '../logger/portfolio.logger'
import { StockSymbol } from '../model/stock.symbol.enum'
import { StockList } from '../stock.list'

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

  // SELECT s.*
  // FROM stock_data_entity s
  // JOIN (
  //     SELECT period
  //     FROM stock_data_entity
  //     ORDER BY period DESC
  //     LIMIT 2
  // ) latest_period ON s.period = latest_period.period

  async getTrendChangeStocks(isTrendChangeDown: boolean): Promise<any[]> {
    let stocks: {
      [key: string]: {
        superTrend: number
        rsi: number
        close: number
      }[]
    } = {}
    try {
      const stocksData: any[] = await this.dataSource.query<StockDataEntity[]>(
        'SELECT s.* FROM stock_data_entity s JOIN ( SELECT DISTINCT period FROM stock_data_entity ORDER BY period DESC LIMIT 2) latest_period ON s.period = latest_period.period',
      )
      // const stocksData: StockDataEntity[] = await this.dataSource
      //   .getRepository(StockDataEntity)
      //   .createQueryBuilder('stock_data')
      //   .select('*')
      //   .where(
      //     'stock_data.period in (SELECT DISTINCT period FROM stock_data ORDER BY period DESC LIMIT 2)',
      //   )
      //   .execute()
      stocksData.forEach((stockData) => {
        if (!stocks[stockData.stock_symbol]) {
          stocks[stockData.stock_symbol] = []
        }
        stocks[stockData.stock_symbol].push({
          superTrend: stockData.stock_technical_data.super_trend,
          rsi: stockData.stock_technical_data.rsi,
          close: stockData.close,
        })
      })
      const stockList = Object.keys(stocks)
      if (isTrendChangeDown) {
        return stockList.filter((stock) => {
          const stockData = stocks[stock]
          return (
            stockData[1].superTrend < stockData[1].close &&
            stockData[0].superTrend > stockData[0].close &&
            stockData[0].rsi < 65
          )
        })
      } else {
        return stockList.filter((stock) => {
          const stockData = stocks[stock]
          return (
            stockData[1].superTrend > stockData[1].close &&
            stockData[0].superTrend < stockData[0].close
          )
        })
      }
    } catch (error) {
      this.logger.error(`Error fetching stock data with error ${error}`)
      throw error
    }
  }

  async getTrendingStocks(isTrendUp: boolean): Promise<any[]> {
    try {
      const stocksData: any[] = await this.dataSource.query<StockDataEntity[]>(
        'SELECT s.* FROM stock_data_entity s JOIN ( SELECT DISTINCT period FROM stock_data_entity ORDER BY period DESC LIMIT 1) latest_period ON s.period = latest_period.period',
      )
      let stocks = []
      if (isTrendUp) {
        stocksData.map((stockData) => {
          if (stockData.stock_technical_data.super_trend < stockData.close) {
            stocks.push(stockData.stock_symbol)
          }
        })
      } else {
        stocksData.map((stockData) => {
          if (
            stockData.stock_technical_data.super_trend > stockData.close &&
            stockData.stock_technical_data.rsi < 65
          ) {
            stocks.push(stockData.stock_symbol)
          }
        })
      }
      return stocks
    } catch (error) {
      this.logger.error(`Error fetching stock data with error ${error}`)
    }
  }

  async getLatestStockData(): Promise<StockDataModel[]> {
    try {
      //s.close < JSON_EXTRACT(s.stock_technical_data, "$.super_trend")
      // get latest stock data where frequency is 'w' and period is latest date for each stock
      const stockDataEntities = await this.dataSource.getRepository(StockDataEntity).find({
        where: { frequency: DataFrequency.WEEKLY },
        order: { period: 'DESC' },
        take: StockList.length,
      })

      return stockDataEntities.map((entity) => {
        const stockData = new StockDataModel()
        stockData.name = entity.stockName
        stockData.symbol = StockSymbol[entity.stockSymbol]
        stockData.ohlcData = {
          close: entity.close,
          high: entity.high,
          low: entity.low,
          open: entity.open,
          volume: entity.volume,
          adjusted_close: entity.adjustedClose,
          date: entity.period,
        }
        stockData.technicalData = entity.stockTechnicalData
        return stockData
      })
    } catch (error) {
      this.logger.error(`Error fetching stock data with error ${error}`)
    }
  }
}
