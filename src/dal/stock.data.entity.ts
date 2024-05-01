import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm'
import { DataFrequency } from '../model/data.frequency.enum'

// "date": "2023-04-28",
// "open": 74.75,
// "high": 76.35,
// "low": 74.45,
// "close": 75.85,
// "adjusted_close": 73.3793,
// "volume": 13167053
@Entity()
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
}
