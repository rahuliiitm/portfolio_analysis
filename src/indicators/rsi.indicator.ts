import { ConfigService } from '@nestjs/config'
import { IIndicator } from './indicator.interface'
import { OHLCDataModel } from '../model/ohlc.data.model'
import { rsi } from 'technicalindicators'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RsiIndicator implements IIndicator {
  constructor(private readonly configService: ConfigService) {}
  name(): string {
    return 'rsi'
  }

  calculate(data: OHLCDataModel[], weekFromLast: number, config?: any): any {
    const period = this.configService.get<number>('RSI_PERIOD') || 14
    const dataFromIndex = data.slice(0, data.length - weekFromLast)
    const input = {
      values: dataFromIndex.map((d) => d.close),
      period: 14,
    }
    const rsiValue = rsi(input)
    // calculate the MA for rsi for the given period
    const rsiMA = rsiValue.slice(rsiValue.length - period).reduce((a, b) => a + b, 0) / period
    return rsiMA
  }
}
