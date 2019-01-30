export interface Log {
  fatal()
  error()
  warn()
  info()
  debug()
  trace()
}

export abstract class LogAbstract implements Log {
	fatal(...params: any[]) { throw new Error('Missing fatal') }
  error(...params: any[]) { throw new Error('Missing error') }
  warn(...params: any[]) { throw new Error('Missing warn') }
  info(...params: any[]) { throw new Error('Missing info') }
  debug(...params: any[]) { throw new Error('Missing debug') }
  trace(...params: any[]) { throw new Error('Missing trace') }
}
