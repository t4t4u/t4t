import type { PrimitiveTypeName, PrimitiveTypeMap } from '../../type'
import { isArray } from '../array'
import type {
  AssertsGuard,
  CreateFilter,
  ExtendedGuards,
  GuardFilter,
  GuardType,
  GuardTypeMap,
  GuardTypeName,
  IsGuard,
  PrimitiveGuardFilter,
  PrimitiveGuards,
  ResolveGuardType,
} from './types'

export const primitiveGuards: PrimitiveGuards = {
  string(value: unknown): value is string {
    return typeof value === 'string'
  },
  number(value: unknown): value is number {
    return typeof value === 'number'
  },
  boolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
  function(value: unknown): value is Function {
    return typeof value === 'function'
  },
  object(value: unknown): value is object | null {
    return typeof value === 'object'
  },
  symbol(value: unknown): value is symbol {
    return typeof value === 'symbol'
  },
  bigint(value: unknown): value is bigint {
    return typeof value === 'bigint'
  },
  undefined(value: unknown): value is undefined {
    return typeof value === 'undefined'
  },
}

export const extendedGuards: ExtendedGuards = {
  ...primitiveGuards,
  function(value: unknown): value is (...args: any[]) => any {
    return typeof value === 'function'
  },
  object(
    value: unknown,
  ): value is Readonly<Record<string | number | symbol, unknown>> {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  },
  plainObject(
    value: unknown,
  ): value is Readonly<Record<string | number | symbol, unknown>> {
    if (value === null || typeof value !== 'object') return false
    const proto = Object.getPrototypeOf(value)
    return proto === null || proto === Object.prototype
  },
  array(value: unknown): value is readonly unknown[] {
    return Array.isArray(value)
  },
  null(value: unknown): value is null {
    return value === null
  },
  nullish(value: unknown): value is null | undefined {
    return value == null
  },
}

type GuardTuple<Map, V> = [
  Array<(keyof Map & string) | `!${keyof Map & string}`>,
  Array<
    ReadonlyArray<GuardType<(keyof Map & string) | `!${keyof Map & string}`>>
  >,
  Array<(value: V) => boolean>,
]

function SplitGuards<Map, V>(
  acc: GuardTuple<Map, V>,
  guard: GuardType<(keyof Map & string) | `!${keyof Map & string}`>,
): GuardTuple<Map, V> {
  if (typeof guard === 'string') {
    acc[0].push(guard)
  } else if (isArray(guard)) {
    acc[1].push(guard)
  } else if (typeof guard === 'function') {
    acc[2].push(guard)
  } else {
    throw new Error(`Invalid guard: ${String(guard)}`)
  }
  return acc
}

function and<V, Map extends Record<string, (value: V) => boolean>>(
  value: V,
  {
    traversedAnd = new Set(),
    traversedOr,
    map,
    guards,
  }: {
    map: Map
    guards: ReadonlyArray<
      GuardType<(keyof Map & string) | `!${keyof Map & string}`>
    >
    traversedAnd?: Set<unknown>
    traversedOr?: Set<unknown>
  },
): boolean {
  traversedAnd.add(value)
  const [stringGuards, nestedGuards, customGuards] = guards.reduce(
    SplitGuards<Map, V>,
    [[], [], []],
  )
  return (
    stringGuards.every(guard => {
      const negated = guard.startsWith('!')
      const key = negated ? guard.slice(1) : guard
      const res = map[key](value)
      return negated ? !res : res
    }) &&
    customGuards.every(guard => guard(value)) &&
    nestedGuards.every(guard => {
      if (traversedOr?.has(value) ?? true) {
        return true
      }
      return or(value, {
        map,
        guards: guard,
        traversedAnd,
        traversedOr,
      })
    })
  )
}

function or<V, Map extends Record<string, (value: V) => boolean>>(
  value: V,
  {
    traversedOr = new Set(),
    traversedAnd,
    map,
    guards,
  }: {
    map: Map
    guards: ReadonlyArray<
      GuardType<(keyof Map & string) | `!${keyof Map & string}`>
    >
    traversedAnd?: Set<unknown>
    traversedOr?: Set<unknown>
  },
): boolean {
  traversedOr.add(value)
  const [stringGuards, nestedGuards, customGuards] = guards.reduce(
    SplitGuards<Map, V>,
    [[], [], []],
  )
  return (
    stringGuards.some(guard => {
      const negated = guard.startsWith('!')
      const key = negated ? guard.slice(1) : guard
      const res = map[key](value)
      return negated ? !res : res
    }) ||
    customGuards.some(guard => guard(value)) ||
    nestedGuards.some(guard => {
      if (traversedAnd?.has(value) ?? true) {
        return true
      }
      return and(value, {
        map,
        guards: guard,
        traversedAnd,
        traversedOr,
      })
    })
  )
}

export const is: IsGuard = Object.assign(
  function is<
    V,
    const Guards extends ReadonlyArray<
      GuardType<GuardTypeName | `!${GuardTypeName}`>
    >,
  >(
    value: V,
    ...guards: Guards
  ): value is ResolveGuardType.And<V, GuardTypeMap, Guards> {
    return and(value, { guards, map: extendedGuards })
  },
  {
    primitive<
      V,
      const Guards extends ReadonlyArray<
        GuardType<PrimitiveTypeName | `!${PrimitiveTypeName}`>
      >,
    >(
      value: V,
      ...guards: Guards
    ): value is ResolveGuardType.And<V, PrimitiveTypeMap, Guards> {
      return and(value, { guards, map: primitiveGuards })
    },
  },
)

export const asserts: AssertsGuard = Object.assign(
  function asserts<
    V,
    const Guards extends ReadonlyArray<
      GuardType<GuardTypeName | `!${GuardTypeName}`>
    >,
  >(
    value: V,
    ...guards: Guards
  ): asserts value is ResolveGuardType.And<V, GuardTypeMap, Guards> {
    if (!and(value, { guards, map: extendedGuards })) {
      throw new Error(
        `Invalid value: ${String(
          value,
        )} does not match any of the asserted types.`,
      )
    }
  },
  {
    primitive<
      V,
      const Guards extends ReadonlyArray<
        GuardType<PrimitiveTypeName | `!${PrimitiveTypeName}`>
      >,
    >(
      value: V,
      ...guards: Guards
    ): value is ResolveGuardType.And<V, PrimitiveTypeMap, Guards> {
      return and(value, { guards, map: primitiveGuards })
    },
  },
)

export const createFilter: CreateFilter = Object.assign(
  function createFilter<
    const Guards extends ReadonlyArray<
      GuardType<GuardTypeName | `!${GuardTypeName}`>
    >,
  >(...guards: Guards): GuardFilter<Guards> {
    type Param = Guards extends ReadonlyArray<(value: infer V) => boolean>
      ? V
      : unknown
    return function guardFilter<V extends Param>(
      value: V,
    ): value is ResolveGuardType.And<V, GuardTypeMap, Guards> {
      return and(value, { guards, map: extendedGuards })
    }
  },
  {
    primitive<
      const Guards extends ReadonlyArray<
        GuardType<PrimitiveTypeName | `!${PrimitiveTypeName}`>
      >,
    >(...guards: Guards): PrimitiveGuardFilter<Guards> {
      type Param = Guards extends ReadonlyArray<(value: infer V) => boolean>
        ? V
        : unknown
      return function primitiveGuardFilter<V extends Param>(
        value: V,
      ): value is Extract<
        V,
        ResolveGuardType.And<V, PrimitiveTypeMap, Guards>
      > {
        return and(value, { guards, map: primitiveGuards })
      }
    },
  },
)
