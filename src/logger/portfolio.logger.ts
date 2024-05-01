import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

@Injectable()
export class PortfolioLogger {
  constructor(
    @InjectPinoLogger(PortfolioLogger.name)
    private readonly logger: PinoLogger,
  ) {}

  assign(data: any) {
    this.logger.assign(data)
  }

  info(portfolioLogger: any, message?: string, ...args: any[]) {
    this.logger.info(portfolioLogger, message, args)
  }

  trace(portfolioLogger: any, message?: string, ...args: any[]) {
    this.logger.trace(portfolioLogger, message, args)
  }

  error(portfolioLogger: any, message?: string, ...args: any[]) {
    this.logger.error(portfolioLogger, message, args)
  }

  warn(portfolioLogger: any, message?: string, ...args: any[]) {
    this.logger.warn(portfolioLogger, message, args)
  }

  debug(portfolioLogger: any, message?: string, ...args: any[]) {
    this.logger.debug(portfolioLogger, message, args)
  }

  fatal(portfolioLogger: any, message?: string, ...args: any[]) {
    this.logger.fatal(portfolioLogger, message, args)
  }
}
