import { Injectable } from '@nestjs/common'
import { StockDataModel } from '../model/stock.data.model'
import { StockDataEntity } from '../dal/stock.data.entity'
import { DataFrequency } from '../model/data.frequency.enum'

@Injectable()
export class StockDataMapper {
  public toStockDataEntity(
    models: StockDataModel[],
    frequency: DataFrequency.WEEKLY,
  ): StockDataEntity[] {
    return models.map((model) => {
      const stockDataEntity = new StockDataEntity()
      stockDataEntity.close = model.ohlcData.close
      stockDataEntity.high = model.ohlcData.high
      stockDataEntity.low = model.ohlcData.low
      stockDataEntity.open = model.ohlcData.open
      stockDataEntity.volume = model.ohlcData.volume
      stockDataEntity.adjustedClose = model.ohlcData.adjusted_close
      stockDataEntity.stockName = model.name
      stockDataEntity.stockSymbol = model.symbol
      stockDataEntity.period = model.ohlcData.date
      stockDataEntity.stockTechnicalData = model.technicalData
      stockDataEntity.frequency = frequency
      stockDataEntity.modifiedAt = new Date()

      return stockDataEntity
    })
  }
}
