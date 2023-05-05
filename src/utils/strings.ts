import type { SplitStringAtIndex } from '../type'

/**
 * Simple wrapper for {@link String.slice} but with better type inference.
 *
 * Returns a section of a string.
 * @param start - The index to the beginning of the specified portion of stringObj.
 * @param end - The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end.
 * If this value is not specified, the substring continues to the end of stringObj.
 */
export function sliceString<const Str extends string>(str: Str): Str
export function sliceString<const Str extends string, const S extends number>(
  str: Str,
  start: S,
): SplitStringAtIndex<Str, S>[1]
export function sliceString<
  const Str extends string,
  const S extends number,
  const E extends number,
>(
  str: Str,
  start: S,
  end: E,
): string extends SplitStringAtIndex<Str, E>[0]
  ? string
  : string extends SplitStringAtIndex<Str, S>[0]
  ? string
  : SplitStringAtIndex<Str, E>[0] extends `${SplitStringAtIndex<
      Str,
      S
    >[0]}${infer Result}`
  ? Result
  : ''
export function sliceString<const Str extends string, const S extends number>(
  str: Str,
  start?: S,
): Str | SplitStringAtIndex<Str, S>[1]
export function sliceString<
  const Str extends string,
  const S extends number,
  const E extends number,
>(
  str: Str,
  start: S,
  end?: E,
):
  | SplitStringAtIndex<Str, S>[1]
  | (string extends SplitStringAtIndex<Str, E>[0]
      ? string
      : string extends SplitStringAtIndex<Str, S>[0]
      ? string
      : SplitStringAtIndex<Str, E>[0] extends `${SplitStringAtIndex<
          Str,
          S
        >[0]}${infer Result}`
      ? Result
      : '')
export function sliceString<
  const Str extends string,
  const S extends number,
  const E extends number,
>(
  str: Str,
  start: S | undefined,
  end: E,
):
  | (string extends SplitStringAtIndex<Str, E>[0]
      ? string
      : string extends SplitStringAtIndex<Str, 0>[0]
      ? string
      : SplitStringAtIndex<Str, E>[0] extends `${SplitStringAtIndex<
          Str,
          0
        >[0]}${infer Result}`
      ? Result
      : '')
  | (string extends SplitStringAtIndex<Str, E>[0]
      ? string
      : string extends SplitStringAtIndex<Str, S>[0]
      ? string
      : SplitStringAtIndex<Str, E>[0] extends `${SplitStringAtIndex<
          Str,
          S
        >[0]}${infer Result}`
      ? Result
      : '')
export function sliceString<
  const Str extends string,
  const S extends number,
  const E extends number,
>(
  str: Str,
  start?: S,
  end?: E,
):
  | Str
  | SplitStringAtIndex<Str, S>[1]
  | (string extends SplitStringAtIndex<Str, E>[0]
      ? string
      : string extends SplitStringAtIndex<Str, 0>[0]
      ? string
      : SplitStringAtIndex<Str, E>[0] extends `${SplitStringAtIndex<
          Str,
          0
        >[0]}${infer Result}`
      ? Result
      : '')
  | (string extends SplitStringAtIndex<Str, E>[0]
      ? string
      : string extends SplitStringAtIndex<Str, S>[0]
      ? string
      : SplitStringAtIndex<Str, E>[0] extends `${SplitStringAtIndex<
          Str,
          S
        >[0]}${infer Result}`
      ? Result
      : '')
export function sliceString(
  str: string,
  ...args: [start?: number, end?: number]
): string {
  return String.prototype.slice.apply(str, args)
}
