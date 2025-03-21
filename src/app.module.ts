import { Module, Provider } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { HttpModule } from '@nestjs/axios'
import { StockList } from './stock.list'
import { StockDataService } from './stock.data.service'
import { FetchDataService } from './fetch.data.service'
import { PortfolioLogger } from './logger/portfolio.logger'
import { DatabaseModule } from './database/database.module'
import { SuperTrendIndicator } from './indicators/supertrend.indictor'
import { StockDataRepository } from './dal/stock.data.repository'
import { StockDataMapper } from './mapper/stock.data.mapper'
import { IIndicator } from './indicators/indicator.interface'

export const indicatorProvider: Provider[] = [
  {
    provide: 'INDICATORS',
    useFactory: (...indicatorProvider: IIndicator[]) => indicatorProvider,
    inject: [SuperTrendIndicator],
  },
]

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      // configure in kubernetes deployment yaml depending on lp_grid and lp_dc
      envFilePath: process.env.ENV_FILE || '.env',
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV')
        const logLevel = configService.get<string>('LOG_LEVEL')

        const pinoConfig: any = {
          customProps: (req, res) => ({
            correlationId: req.headers['x-correlation-id'],
            requestId: req.headers['x-request-id'],
          }),
          level: logLevel || 'debug',
          redact: ['request.headers.authorization'],
        }

        if (nodeEnv === 'dev' || nodeEnv === 'test') {
          pinoConfig.transport = {
            target: 'pino-pretty',
            options: {
              singleLine: true,
            },
          }
        }

        return {
          pinoHttp: pinoConfig,
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'STOCK_SYMBOL_LIST',
      useValue: StockList,
    },
    StockDataService,
    FetchDataService,
    PortfolioLogger,
    ...indicatorProvider,
    StockDataRepository,
    StockDataMapper,
    SuperTrendIndicator,
  ],
})
export class AppModule {}
