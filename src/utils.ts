import { flow, map, compact } from "lodash/fp";

export interface PromiseReflect {
  status: string
  value?: any
  error?: any
}

// Wait Promise.all to finish all promise
// http://stackoverflow.com/a/31424853/788518
export async function reflect (promise: Promise<any>): Promise<PromiseReflect> {
  try {
    const value = await promise
    return { value, status: 'resolved' }
  } catch (error) {
    return { error, status: 'rejected' }
  }
}

export function isClass (v: any): boolean {
  return typeof v === 'function' && v.prototype.constructor === v
}

export function retrieveReflect (list: any[], field: string): PromiseReflect[] {
  return flow(
    map(field),
    compact
  )(list)
}

export async function errorHandler (app, err): Promise<void> {
  if (err) {
    app.log.error(err)
  }

  try {
    await app.magnet.shutdown(app)
    app.log.info('Complete teardown all Magnet\'s module')
    process.exit()
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
