import type { AssertsGuard, IsGuard, CreateFilter } from './types'
import { asserts, createFilter, is } from './impl'

export { asserts, createFilter, is }

export type * from './types'

export interface Guard {
  is: IsGuard
  asserts: AssertsGuard
  createFilter: CreateFilter
}

const guards: Guard = {
  is,
  asserts,
  createFilter,
}

export default guards
