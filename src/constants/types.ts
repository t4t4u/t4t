export const PRIMITIVE_TYPE_NAMES = [
  'string',
  'number',
  'boolean',
  'function',
  'object',
  'symbol',
  'bigint',
  'undefined',
] as const

export const EXTENDED_TYPE_NAMES = [
  ...PRIMITIVE_TYPE_NAMES,
  'object',
  'array',
  'null',
] as const satisfies readonly [...typeof PRIMITIVE_TYPE_NAMES, ...string[]]
