import type { NonNegativeIntLiteral } from './numbers'

/**
 * Recursively shift the first character of a string to
 * the Left generic parameter until Counter has the length
 * of Index.
 */
type SplitStringAtIndexImpl<
  Left extends string,
  Right extends string,
  Index extends number,
  Counter extends never[],
> = string extends Right
  ? [string, string]
  : Counter['length'] extends Index
  ? [Left, Right]
  : Right extends ''
  ? [Left, '']
  : Right extends `${infer T}${''}${infer U}`
  ? T extends ''
    ? [Left, string]
    : string extends T
    ? [string, string]
    : SplitStringAtIndexImpl<`${Left}${T}`, U, Index, [...Counter, never]>
  : [Left, Right]

/**
 * Rotate the history of the string until we reach the end of the string.
 * Then check if any of the characters we iterated over were strings of unknown length.
 */
type SplitStringAtIndexFromEndRollingHistory<
  Left extends string,
  Right extends string,
  History extends ReadonlyArray<readonly [string, string, string]>,
> = Right extends `${infer T}${infer U}`
  ? SplitStringAtIndexFromEndRollingHistory<
      `${Left}${T}`,
      U,
      History extends readonly [
        readonly [string, string, string],
        ...infer Rest extends ReadonlyArray<readonly [string, string, string]>,
      ]
        ? [...Rest, [Left, T, Right]]
        : never
    >
  : History[0] extends never
  ? ['', '']
  : History extends ReadonlyArray<readonly [string, infer P, string]>
  ? string extends P
    ? [string, string]
    : [History[0][0], History[0][2]]
  : [string, string]

/**
 * Recursively shift the first character of a string to
 * the Left generic parameter until History has the length
 * of Index. Then start to use {@link SplitStringAtIndexFromEndRollingHistory}
 */
type SplitStringAtIndexFromEndFillHistory<
  Left extends string,
  Right extends string,
  Index extends number,
  History extends Array<[string, string, string]>,
> = History['length'] extends Index
  ? SplitStringAtIndexFromEndRollingHistory<Left, Right, History>
  : Right extends `${infer T}${infer U}`
  ? SplitStringAtIndexFromEndFillHistory<
      `${Left}${T}`,
      U,
      Index,
      [...History, [Left, T, Right]]
    >
  : History[0] extends never
  ? ['', '']
  : History extends ReadonlyArray<readonly [string, infer P, string]>
  ? string extends P
    ? [string, string]
    : [History[0][0], History[0][2]]
  : [string, string]

// Invalid integer marker
declare const INVALID_NUMBER: unique symbol

/**
 * Split a string literal at a given index.
 * @typeParam S - The string to split. (Must be a string literal)
 * @typeParam D - The index at which to split the string. (Must be a number literal)
 * @example
 * ```ts
 * SplitStringAtIndex<"Hello World", 5> // -> ["Hello", " World"]
 *
 * // The string "Hello World" was split at index 5, resulting in the array ["Hello", " World"]
 * ```
 * @example
 * ```ts
 * SplitStringAtIndex<string, 0> // -> [string, string]
 *
 * // The string was not a string literal, resulting in the array [string, string]
 * ```
 * @example
 * ```ts
 * SplitStringAtIndex<"Hello World", number> // -> [string, string]
 *
 * // The index was not a number literal, resulting in the array [string, string]
 * ```
 * @example
 * ```ts
 * SplitStringAtIndex<`${string} World`, 1> // -> [string, string]
 *
 * // Counting over a string injection variable, results in the array [string, string]
 * // since the string injection variable could be any length.
 * ```
 * @example
 * ```ts
 * SplitStringAtIndex<`Hello ${string}`, 1> // -> ["H", `ello ${string}`]
 *
 * // Having a string injection variable before the index works as expected.
 * // With positive indices that is the right side of the split.
 * ```
 * @example
 * ```ts
 * SplitStringAtIndex<`${string} World`, 1> // -> [`${string} Worl`, "d"]
 *
 * // Having a string injection variable before the index works as expected.
 * // With negative indices that is the left side of the split.
 * ```
 * @example
 * ```ts
 * SplitStringAtIndex<"Hello World", 100> // -> ["Hello World", "]
 *
 * // The index was greater than the length of the string, resulting in the array ["Hello World", "]
 * ```
 * @example
 * ```ts
 * SplitStringAtIndex<"Hello World", -1> // -> ["Hello Worl", "d"]
 *
 * // The index was negative, resulting in the slice happening from end of string array ["Hello Worl", "d"]
 * ```
 * @example
 * ```ts
 * SplitStringAtIndex<`Hello ${string}`, -1> // -> [string, string]
 *
 * // Counting over a string injection variable, results in the array [string, string]
 * ```
 * @example
 * ```ts
 * SplitStringAtIndex<"Hello World", 0> // -> [", "Hello World"]
 *
 * // The index was 0, resulting in the array [", "Hello World"]
 * ```
 */
export type SplitStringAtIndex<
  S extends string,
  D extends number,
> = `${D}` extends `-${infer N extends number}`
  ? NonNegativeIntLiteral<
      N,
      typeof INVALID_NUMBER
    > extends typeof INVALID_NUMBER
    ? [string, string]
    : NonNegativeIntLiteral<N, typeof INVALID_NUMBER> extends number
    ? S extends `${infer ActualString}`
      ? NonNegativeIntLiteral<N, typeof INVALID_NUMBER> extends 0
        ? ['', ActualString]
        : SplitStringAtIndexFromEndFillHistory<
            '',
            ActualString,
            NonNegativeIntLiteral<N, typeof INVALID_NUMBER>,
            []
          >
      : N extends 0
      ? ['', S]
      : SplitStringAtIndexFromEndFillHistory<
          '',
          S,
          NonNegativeIntLiteral<N, typeof INVALID_NUMBER>,
          []
        >
    : never
  : NonNegativeIntLiteral<
      D,
      typeof INVALID_NUMBER
    > extends typeof INVALID_NUMBER
  ? [string, string]
  : NonNegativeIntLiteral<D, typeof INVALID_NUMBER> extends number
  ? S extends `${infer ActualString}`
    ? D extends 0
      ? ['', ActualString]
      : SplitStringAtIndexImpl<
          '',
          ActualString,
          NonNegativeIntLiteral<D, typeof INVALID_NUMBER>,
          []
        >
    : D extends 0
    ? ['', S]
    : SplitStringAtIndexImpl<
        '',
        S,
        NonNegativeIntLiteral<D, typeof INVALID_NUMBER>,
        []
      >
  : never
