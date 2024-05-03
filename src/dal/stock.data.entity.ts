import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'
import { DataFrequency } from '../model/data.frequency.enum'

@Entity()
@Index(['stockSymbol', 'period', 'frequency'], { unique: true })
export class StockDataEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column()
  frequency: DataFrequency

  @Column({ name: 'stock_symbol' })
  stockSymbol: string

  @Column({ name: 'stock_name' })
  stockName: string

  @Column()
  period: Date

  @Column()
  open: number

  @Column()
  high: number

  @Column()
  low: number

  @Column()
  close: number

  @Column()
  volume: number

  @Column({ name: 'adjusted_close' })
  adjustedClose: number

  @Column({ name: 'stock_technical_data', type: 'json' })
  stockTechnicalData: any

  @Column({ name: 'modified_at', type: 'timestamp', nullable: true })
  modifiedAt: Date
}
