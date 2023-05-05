/**
 * Ensure that a number is a positive integer literal.
 * @typeParam T - The number to check.
 * @typeParam Invalid - The type to resolve to if T is not a positive integer literal.
 */
export type NonNegativeIntLiteral<
  T extends number,
  Invalid = never,
  Valid = T,
> = number extends T
  ? Invalid
  : `${T}` extends `${string}e${string}` | `${string}.${string}` | `-${string}`
  ? Invalid
  : Valid
