import type {
  ExtendedTypeMap,
  PrimitiveTypeMap,
  PrimitiveTypeName,
  UnionToIntersection,
  Widen,
} from '../../type'

export type PrimitiveGuards = {
  [key in PrimitiveTypeName]: (value: unknown) => value is PrimitiveTypeMap[key]
}

export type GuardTypeMap = ExtendedTypeMap & {
  plainObject: Readonly<Record<string | number | symbol, unknown>>
  nullish: null | undefined
}

export type GuardTypeName = keyof GuardTypeMap

export type ExtendedGuards = {
  [key in GuardTypeName]: (value: unknown) => value is GuardTypeMap[key]
}

/**
 * Resolve to any type in the union B that are assignable to a widened union A.
 */
type WideAssignable<A, B> = Extract<B, Widen<A>>

type PerformAnd<T extends readonly unknown[]> = T extends readonly [
  infer Head,
  ...infer Tail,
]
  ? Head & PerformAnd<Tail>
  : UnionToIntersection<T[number]>

type ResolveRegularString<
  T,
  TypeMap extends Readonly<Record<string, unknown>>,
  Guard extends GuardType<
    Extract<keyof TypeMap, string> | `!${Extract<keyof TypeMap, string>}`
  >,
> = Guard extends keyof TypeMap
  ? T extends any
    ? Extract<T, TypeMap[Guard]> extends never
      ? WideAssignable<T, TypeMap[Guard]>
      : Extract<T, TypeMap[Guard]>
    : never
  : never

type ResolveNegatedString<
  T,
  TypeMap extends Readonly<Record<string, unknown>>,
  Guard extends GuardType<
    Extract<keyof TypeMap, string> | `!${Extract<keyof TypeMap, string>}`
  >,
> = Guard extends `!${infer Key extends Extract<keyof TypeMap, string>}`
  ? Exclude<T, TypeMap[Key]>
  : never

type ResolveCustomFunction<
  T,
  TypeMap extends Readonly<Record<string, unknown>>,
  Guard extends GuardType<
    Extract<keyof TypeMap, string> | `!${Extract<keyof TypeMap, string>}`
  >,
> = Guard extends (val: any) => val is infer V
  ? T extends any
    ? Extract<T, V> extends never
      ? WideAssignable<T, V>
      : Extract<T, V>
    : never
  : never

export declare namespace ResolveGuardType {
  /**
   * Apply the guards to type T and intersect the result, effectively an AND operation.
   */
  type And<
    T,
    TypeMap extends Readonly<Record<string, unknown>>,
    Guards extends ReadonlyArray<
      GuardType<
        Extract<keyof TypeMap, string> | `!${Extract<keyof TypeMap, string>}`
      >
    >,
  > = {
    [guardIndex in keyof Guards]: Guards[guardIndex] extends
      | keyof TypeMap
      // eslint-disable-next-line @typescript-eslint/ban-types
      | Function
      | readonly unknown[]
      ?
          | ResolveRegularString<T, TypeMap, Guards[guardIndex]>
          | ResolveCustomFunction<T, TypeMap, Guards[guardIndex]>
          | Or<
              T,
              TypeMap,
              Extract<
                Guards[guardIndex],
                ReadonlyArray<
                  GuardType<
                    | Extract<keyof TypeMap, string>
                    | `!${Extract<keyof TypeMap, string>}`
                  >
                >
              >
            >
      : unknown
  } extends infer Q extends readonly unknown[]
    ? {
        [guardIndex in keyof Guards]:
          | ResolveRegularString<T, TypeMap, Guards[guardIndex]>
          | ResolveCustomFunction<T, TypeMap, Guards[guardIndex]>
          | Or<
              PerformAnd<Q> & T,
              TypeMap,
              Extract<
                Guards[guardIndex],
                ReadonlyArray<
                  GuardType<
                    | Extract<keyof TypeMap, string>
                    | `!${Extract<keyof TypeMap, string>}`
                  >
                >
              >
            >
          | ResolveNegatedString<PerformAnd<Q> & T, TypeMap, Guards[guardIndex]>
      } extends infer R extends readonly unknown[]
      ? PerformAnd<R> & T
      : never
    : never

  /**
   * Apply the guards to type T and union the result, effectively an OR operation.
   */
  type Or<
    T,
    TypeMap extends Readonly<Record<string, unknown>>,
    Guards extends ReadonlyArray<
      GuardType<
        Extract<keyof TypeMap, string> | `!${Extract<keyof TypeMap, string>}`
      >
    >,
  > = {
    [guardIndex in keyof Guards]:
      | ResolveRegularString<T, TypeMap, Guards[guardIndex]>
      | ResolveNegatedString<T, TypeMap, Guards[guardIndex]>
      | ResolveCustomFunction<T, TypeMap, Guards[guardIndex]>
      | And<
          T,
          TypeMap,
          Extract<
            Guards[guardIndex],
            ReadonlyArray<
              GuardType<
                | Extract<keyof TypeMap, string>
                | `!${Extract<keyof TypeMap, string>}`
              >
            >
          >
        >
  }[number] extends infer Q
    ? T & Q
    : never
}

export type GuardType<TypeNames extends string> =
  | TypeNames
  | ((value: any) => boolean)
  | ReadonlyArray<GuardType<TypeNames>>

export interface IsGuard {
  <
    V,
    const Guards extends ReadonlyArray<
      GuardType<GuardTypeName | `!${GuardTypeName}`>
    >,
  >(
    value: V,
    ...guards: Guards
  ): value is ResolveGuardType.And<V, GuardTypeMap, Guards>
  primitive: <
    V,
    const Guards extends ReadonlyArray<
      GuardType<PrimitiveTypeName | `!${PrimitiveTypeName}`>
    >,
  >(
    value: V,
    ...guards: Guards
  ) => value is ResolveGuardType.And<V, PrimitiveTypeMap, Guards>
}

export interface AssertsGuard {
  <
    V,
    const Guards extends ReadonlyArray<
      GuardType<GuardTypeName | `!${GuardTypeName}`>
    >,
  >(
    value: V,
    ...guards: Guards
  ): asserts value is ResolveGuardType.And<V, GuardTypeMap, Guards>

  primitive: <
    V,
    const Guards extends ReadonlyArray<
      GuardType<PrimitiveTypeName | `!${PrimitiveTypeName}`>
    >,
  >(
    value: V,
    ...guards: Guards
  ) => asserts value is ResolveGuardType.And<V, PrimitiveTypeMap, Guards>
}

export type GuardFilter<
  Guards extends ReadonlyArray<GuardType<GuardTypeName | `!${GuardTypeName}`>>,
> = <
  V extends Guards extends ReadonlyArray<(value: infer Param) => boolean>
    ? Param
    : unknown,
>(
  value: V,
) => value is ResolveGuardType.And<V, GuardTypeMap, Guards>
export type PrimitiveGuardFilter<
  Guards extends ReadonlyArray<
    GuardType<PrimitiveTypeName | `!${PrimitiveTypeName}`>
  >,
> = <
  V extends Guards extends ReadonlyArray<(value: infer Param) => boolean>
    ? Param
    : unknown,
>(
  value: V,
) => value is ResolveGuardType.And<V, PrimitiveTypeMap, Guards>

export interface CreateFilter {
  <
    const Guards extends ReadonlyArray<
      GuardType<GuardTypeName | `!${GuardTypeName}`>
    >,
  >(
    ...guards: Guards
  ): GuardFilter<Guards>
  primitive: <
    const Guards extends ReadonlyArray<
      GuardType<PrimitiveTypeName | `!${PrimitiveTypeName}`>
    >,
  >(
    ...guards: Guards
  ) => PrimitiveGuardFilter<Guards>
}
