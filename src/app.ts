import Magnet from './magnet'
import { LogAbstract } from './log'

export interface App {
  log: LogAbstract
  magnet?: Magnet
  config?: any
  [propName: string]: any
}
