import { PRIMITIVE_TYPE_NAMES, EXTENDED_TYPE_NAMES } from '../constants/types'
import type { ExtendedTypeName, PrimitiveTypeName } from '../type'

export function isPrimitiveTypeString(key: string): key is PrimitiveTypeName {
  return (PRIMITIVE_TYPE_NAMES as readonly string[]).includes(key)
}

export function isTypeString(key: string): key is ExtendedTypeName {
  return (EXTENDED_TYPE_NAMES as readonly string[]).includes(key)
}
