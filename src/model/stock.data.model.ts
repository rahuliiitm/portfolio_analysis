import { OHLCDataModel } from './ohlc.data.model'
import { StockSymbol } from './stock.symbol.enum'

export class StockDataModel {
  symbol: StockSymbol
  name: string
  ohlcData: OHLCDataModel
  technicalData: any
}
