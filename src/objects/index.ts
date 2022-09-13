import type { Promisable } from '../type'

/**
 * Improvement of Object.entries that respects known types.
 */
export function entries<In extends Record<string, unknown>>(
  input: In,
): Array<
  {
    [key in keyof In]: [key, In[key]]
  }[keyof In & string]
> {
  return Object.entries(input) as Array<
    {
      [key in keyof In]: [key, In[key]]
    }[keyof In & string]
  >
}

/**
 * Construct an object from entries, analogous to `entries`
 */
export function fromEntries<In extends Array<[string, unknown]>>(
  input: In,
): { [key in In[number][0]]: (In[number] & readonly [key, unknown])[1] } {
  return Object.fromEntries(input) as {
    [key in In[number][0]]: (In[number] & readonly [key, unknown])[1]
  }
}

/**
 * Map the entries of an object.
 * Unlike `map`, this function can modify both keys and values.
 *
 * @param fn - the function with which object entries are mapped. Takes the same
 * parameters as `.map` called on the regular `Object.entries`, meaning the
 * first parameter is a tuple of `[key, value]`. This differs from `map`.
 */
export async function mapEntries<In, Out>(
  input: Record<string, In>,
  fn: (
    [key, val]: [string, In],
    index: number,
    entries: Array<[string, In]>,
  ) => Promisable<[string, Out]>,
): Promise<Record<string, Out>> {
  const inputEntries = entries(input)
  const res = inputEntries.map(
    async ([key, val], index, entries) => await fn([key, val], index, entries),
  )
  return fromEntries(await Promise.all(res))
}

/**
 * Map the entries of an object.
 * Unlike `mapEntries`, this function cannot modify keys.
 *
 * @param fn - the function by which the object is mapped.
 */
export async function map<In, Out>(
  input: Record<string, In>,
  fn: (val: In, key: string, obj: typeof input) => Promisable<Out>,
): Promise<Record<string, Out>> {
  return await mapEntries(input, async ([key, val]) => [
    key,
    await fn(val, key, input),
  ])
}

export async function forEach<In>(
  input: Record<string, In>,
  fn: (val: In, key: string) => Promise<unknown>,
): Promise<void> {
  const inputEntries = entries(input)
  await Promise.all(inputEntries.map(async ([key, val]) => await fn(val, key)))
}

export function filter<
  In extends Record<string, unknown>,
  OutVal extends In[keyof In],
>(
  input: In,
  fn: (val: In[keyof In], key: keyof In) => val is OutVal,
): {
  [key in keyof In & string]: In[key] extends OutVal ? OutVal & In[key] : never
}
export function filter<In extends Record<string, unknown>>(
  input: In,
  fn: (val: In[keyof In], key: keyof In) => boolean,
): {
  [key in keyof In & string]?: In[key]
}
export function filter<In extends Record<string, unknown>>(
  input: In,
  fn: (val: In[keyof In], key: keyof In) => boolean,
) {
  const inputEntries = entries(input)
  const filteredEntries = inputEntries.filter(([key, val]) => fn(val, key))
  return Object.fromEntries(filteredEntries)
}
