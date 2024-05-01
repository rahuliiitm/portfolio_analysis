import { DataFrequency } from '../model/data.frequency.enum'
import { OHLCDataModel } from '../model/ohlc.data.model'

export interface IIndicator {
  name(): string
  calculate(data: OHLCDataModel[], timeframe: DataFrequency, config?: any): number
}
