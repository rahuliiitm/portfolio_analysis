import { ConfigService } from '@nestjs/config'
import { DataFrequency } from '../model/data.frequency.enum'
import { OHLCDataModel } from '../model/ohlc.data.model'
import { IIndicator } from './indicator.interface'
import { supertrend } from 'supertrend'
import { PortfolioLogger } from '../logger/portfolio.logger'
import { Injectable } from '@nestjs/common'
import { In } from 'typeorm'
import { IndicatorType } from '../model/indicator.type.enum'
import { RSI, rsi } from 'technicalindicators'

@Injectable()
export class SuperTrendIndicator implements IIndicator {
  constructor(
    private configService: ConfigService,
    private logger: PortfolioLogger,
  ) {}

  name(): string {
    return IndicatorType.SUPER_TREND
  }

  calculate(data: OHLCDataModel[], weekFromLast: number, config?: any): number {
    const superTrendPeriod: number = this.configService.get<number>('SUPER_TREND_PERIOD')
    const superTrendMultiplier: number = this.configService.get<number>('SUPER_TREND_MULTIPLIER')
    let superTrendPrices = []
    for (const stockData of data) {
      superTrendPrices.push({ close: stockData.close, high: stockData.high, low: stockData.low })
    }

    const superTrend = supertrend({
      initialArray: superTrendPrices,
      period: superTrendPeriod,
      multiplier: superTrendMultiplier,
    })
    // return the last super trend value
    return superTrend[superTrend.length - 1 - weekFromLast]
  }
}
