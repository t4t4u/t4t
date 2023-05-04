/**
 * Take a type and return a union of all the types it extends.
 *
 * @example
 * ```ts
 * type Type = 'literal string'
 * type WideType = Widen<Type>; // -> string
 *
 * // The provided Type was a literal string, so it was widened to a string.
 * ```
 * @example
 * ```ts
 * type Type = 1 | 2 | 3;
 * type WideType = Widen<Type>; // -> number
 *
 * // The provided Type was a union of literal numbers, so it was widened to number.
 * ```
 * @example
 * ```ts
 * type Type = 'literal string' | 1 | 2 | 3;
 * type WideType = Widen<Type>; // -> string | number
 *
 * // The provided Type was a union of literal strings and numbers, so it was widened to string | number.
 * ```
 * @example
 * ```ts
 * type Type = string | number | boolean;
 * type WideType = Widen<Type>; // -> string | number | boolean
 *
 * // The provided Type was already as wide as possible, so it was returned unchanged.
 * ```
 * @example
 * ```ts
 * type Type = { a: 1 } | { b: 2 };
 * type WideType = Widen<Type>; // object
 *
 * // This does not recurse into objects. For that feature, see {@link Shape}
 * ```
 */
export type Widen<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends symbol
  ? symbol
  : T extends bigint
  ? bigint
  : T extends undefined
  ? undefined
  : T extends null
  ? null
  : T extends object
  ? object
  : unknown

/**
 * Recursively {@link Widen | widens} all properties of an object/array/tuple type.
 *
 * @example
 * ```ts
 * type Type = { a: 1; b: 2 };
 * type ShapeType = Shape<Type>; // -> { a: number; b: number }
 *
 * // The provided Type was an object, so it was recursed into and had its properties widened.
 * ```
 * @example
 * ```ts
 * type Type = { a: 2 | 'literal string };
 * type ShapeType = Shape<Type>; // -> { a: number } | { b: number | string }
 *
 * // The provided Type had property that was a union, it was widened into the widest possible union.
 * ```
 * @example
 * ```ts
 * type Type = { a: 1 } | { b: 2 | 'literal string };
 * type ShapeType = Shape<Type>; // -> { a: number } | { b: number | string }
 *
 * // The provided Type was a union of objects, so it was recursed into and had its properties widened.
 * ```
 * @example
 * ```ts
 * type Type = { a: 1 b: { c: 4} };
 * type ShapeType = Shape<Type>; // -> { a: number b: { c: number } }
 *
 * // The provided Type was an object with a nested object, so it was recursed into and had its properties widened recursively.
 * ```
 * @example
 * ```ts
 * type Type = 'literal string';
 * type ShapeType = Shape<Type>; // -> string
 *
 * // The provided Type was not an object, so this is equivalent to Widen
 * ```
 * @see {@link Widen}
 * @example
 * ```ts
 * type Type = 'literal string' | { a: 2 | { b: 'literal string' } };
 * type ShapeType = Shape<Type>; // -> string | { a: number | { b: string } }
 *
 * // The provided Type was a union of an object and a literal string, so it was recursed into and had its properties widened.
 * // Note that unions of literals are widened even when they're in a union with an object.
 * // but the object inself is recursed into.
 * ```
 */
export type Shape<T> = T extends object
  ? { [key in keyof T]: Shape<T[key]> }
  : Widen<T>

/**
 * Takes a union of keys and returns an object with those keys.
 *
 * @typeParam Keys - The union of keys to make an object from.
 * Allows for arrays/tuples in order to simplify `MakeShape<typeof keyArray>`
 * @typeParam Val - The type of the values of the object, defaults to `any`
 *
 * @example
 * ```ts
 * type Names = 'sandra' | 'joe' | 'bob';
 * type NameMap = MakeShape<Names>; // { sandra: any, joe: any, bob: any }
 * ```
 * @example
 * ```ts
 * type Names = 'sandra' | 'joe' | 'bob';
 * type NameMap = MakeShape<Names, string>; // { sandra: string, joe: string, bob: string }
 * ```
 */
export type MakeShape<
  Keys extends
    | string
    | symbol
    | number
    | ReadonlyArray<string | symbol | number>,
  Val = any,
> = { [key in Keys extends readonly unknown[] ? Keys[number] : Keys]: Val }

/**
 * Makes a type Arrayable by allowing it to be a single value or an array of values.
 */
export type Arrayable<T> = T | readonly T[]

/**
 * Makes a type Promisable by allowing it to be a single value or a Promise of a value.
 */
export type Promisable<T> = T | PromiseLike<T>

/**
 * Turns a union of types into an intersection of those types.
 *
 * @example
 * ```ts
 * type Type = 'literal string' | string;
 * type IntersectionType = UnionToIntersection<Type>; // -> 'literal string'
 *
 * // The provided Type was a union of a literal string and a string, which can be intersected into the literal string.
 * ```
 * @example
 * ```ts
 * type Type = { a: 1 } | { b: 2 };
 * type IntersectionType = UnionToIntersection<Type>; // -> { a: 1 } & { b: 2 }
 *
 * // The provided Type was a union of objects, which can be intersected into the intersection of those objects.
 * ```
 * @example
 * ```ts
 * type Type = 'literal string' | 1 | 2 | 3;
 * type IntersectionType = UnionToIntersection<Type>; // -> 'literal string' & 1 & 2 & 3 -> never
 *
 * // The provided Type was a union of literal strings and numbers, which cannot be intersected, resulting in `never`.
 * ```
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never
