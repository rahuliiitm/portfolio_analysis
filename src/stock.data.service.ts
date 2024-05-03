import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StockSymbol } from './model/stock.symbol.enum'
import { Constants } from './constants'
import { OHLCDataModel } from './model/ohlc.data.model'
import { catchError, firstValueFrom } from 'rxjs'
import { AxiosError } from 'axios'
import { StockDataModel } from './model/stock.data.model'
import { PortfolioLogger } from './logger/portfolio.logger'
import { IIndicator } from './indicators/indicator.interface'
import { DataFrequency } from './model/data.frequency.enum'
import { StockDataRepository } from './dal/stock.data.repository'

@Injectable()
export class StockDataService {
  constructor(
    private readonly logger: PortfolioLogger,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('STOCK_SYMBOL_LIST') private readonly stockList: StockSymbol[],
    @Inject('INDICATORS') private readonly indicators: IIndicator[],
    private readonly stockDataRepository: StockDataRepository,
  ) {}

  async fetchStockData(offset: number = 0): Promise<StockDataModel[]> {
    this.logger.debug('Fetching stock data')
    const dataPeriod = this.configService.get<string>('DATA_PERIOD')
    const apiKey = this.configService.get<string>('API_KEY')
    const apiResponseFormat = this.configService.get<string>('API_RESPONSE_FORMAT')
    const limit = this.configService.get<number>('FETCH_LIMIT') || 20
    let stocksData: StockDataModel[] = []
    try {
      for (let current = offset; current < limit && current < this.stockList.length; current++) {
        const stock = this.stockList[current]
        const response = await this.getStockData(stock, dataPeriod, apiKey, apiResponseFormat)
        const technicalData: { [key: string]: any } = {}
        this.indicators.map((indicator) => {
          let result = indicator.calculate(response, DataFrequency.WEEKLY)
          this.logger.debug(`Indicator ${indicator.name()} for ${stock} is ${result}`)
          technicalData[indicator.name()] = result
        })
        const stockData = new StockDataModel()
        stockData.symbol = stock
        stockData.name = Object.keys(StockSymbol).find((key) => StockSymbol[key] === stock)
        stockData.ohlcData = response[response.length - 1]
        stockData.technicalData = technicalData
        stocksData.push(stockData)
        this.logger.debug(`Fetched data for ${stock}`)
        await this.stockDataRepository.saveStockData([stockData])
        this.logger.debug(`saved stocks data for symbol ${stock} with data  ${stocksData}`)
      }
    } catch (error) {
      this.logger.error(`Error fetching data for with error ${error}`)
    }
    return stocksData
  }

  private async getStockData(
    symbol: StockSymbol,
    dataPeriod: string,
    apiKey: string,
    apiResponseFormat: string,
  ) {
    try {
      const url = this.generateUrl(symbol, dataPeriod, apiKey, apiResponseFormat)
      const response = await firstValueFrom(this.httpService.get<OHLCDataModel[]>(url))
      this.logger.debug(`Fetched stock data for ${symbol}`)
      return response.data
    } catch (error) {
      this.logger.error(`Error fetching data for ${symbol} with error ${error}`)
    }
  }

  private generateUrl(
    symbol: StockSymbol,
    dataPeriod: string,
    apiKey: string,
    apiResponseFormat: string,
  ) {
    const baseUrl = Constants.BASE_URL
    //https://eodhd.com/api/eod/UNIONBANK.NSE?period=w&api_token=66232040e0aef4.08652594&fmt=json
    const url = `${baseUrl}/${symbol}.NSE?api_token=${apiKey}&period=${dataPeriod}&fmt=${apiResponseFormat}`
    return url
  }
}
