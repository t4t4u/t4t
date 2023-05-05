declare const EXTRANEOUS_KEYS: unique symbol

/**
 * Ensures that the type T have the exact same key as U and that all properties of T are assignable to U.
 *
 * If this type errors with T, it's likely that T is missing keys defined in U.
 *
 * If this type errors with U, it's likely that T contains extraneous keys not defined in U.
 *
 * @typeParam T - The type to check.
 * @typeParam U - The shape to ensure conformity to.
 *
 * @remarks
 * This type does not check extraneous keys in nested objects.
 *
 * @example
 * ```ts
 * type Names = 'sandra' | 'joe' | 'bob';
 * type LastNameMap = SatisfiesShape<{ sandra: 'Jones', joe: 'Barley', bob: 'Uncle'}, MakeShape<Names>>;
 * ```
 * works because all keys of Names are present in the object map, with no extraneous keys
 * @example
 * ```ts
 * type Names = 'sandra' | 'joe' | 'bob' | 'jim';
 * type LastNameMap = SatisfiesShape<{ sandra: 'Jones', joe: 'Barley', bob: 'Uncle'}, MakeShape<Names>>;
 * ```
 * errors because jim is missing from the object map
 * @example
 * ```ts
 * type Names = 'sandra' | 'joe' | 'bob';
 * type LastNameMap = SatisfiesShape<{ sandra: 'Jones', joe: 'Barley', bob: 'Uncle', jim: 'Smith'}, MakeShape<Names>>;
 * ```
 * errors because jim is an extraneous key in the object map
 * @example
 * ```ts
 * type Names = 'sandra' | 'joe' | 'bob';
 * type LastNameMap = SatisfiesShape<{ sandra: 'Jones', joe: 'Barley', bob: 'Uncle'}, MakeShape<Names, null>>;
 * ```
 * errors because the values of the object map are not null
 */
export type SatisfiesShape<T extends U, U extends { [key in keyof T]: any }> = T

/**
 * Ensures that all types of T have the keys of U.
 *
 * @example
 * ```ts
 * type Names = 'sandra' | 'joe' | 'bob';
 * type LastNameMap = SatisfyKeys<{ sandra: 'Jones', joe: 'Barley', bob: 'Uncle'}, Names>;
 * ```
 * works because all keys of Names are present in the object map
 * @example
 * ```ts
 * type Names = 'sandra' | 'joe' | 'bob' | 'jim';
 * type LastNameMap = SatisfyKeys<{ sandra: 'Jones', joe: 'Barley', bob: 'Uncle'}, Names>;
 * ```
 * errors because jim is missing from the object map
 * @example
 * ```ts
 * type Names = 'sandra' | 'joe' | 'bob';
 * type LastNameMap = SatisfyKeys<{ sandra: 'Jones', joe: 'Barley', bob: 'Uncle', jim: 'Smith'}, Names>;
 * ```
 * works because extraneous keys are allowed. If want to disallow extraneous keys, use {@link SatisfiesShape}
 */
export type SatisfyKeys<
  T extends { [key in U]: any },
  U extends keyof T,
> = T extends any
  ? Exclude<keyof T, U> extends never
    ? T
    :
        | { [EXTRANEOUS_KEYS]: Exclude<keyof T, U> }
        | { [key in keyof Pick<T, U>]: Pick<T, U>[key] }
  : never
