import Magnet from './magnet'
import { LogAbstract } from './log'

export interface App {
  magnet: Magnet
  log?: LogAbstract
  config?: any
  [propName: string]: any
}
