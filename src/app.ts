import Magnet from './magnet'
import { LogAbstract } from './log'

export interface App {
  magnet: Magnet
  config?: any
  log?: LogAbstract
}
