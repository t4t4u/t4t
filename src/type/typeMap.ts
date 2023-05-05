import type { SatisfiesShape } from './satisfy'
import type { MakeShape } from './misc'
import type {
  EXTENDED_TYPE_NAMES,
  PRIMITIVE_TYPE_NAMES,
} from '../constants/types'

export type ExtendedTypeName = (typeof EXTENDED_TYPE_NAMES)[number]
export type PrimitiveTypeName = (typeof PRIMITIVE_TYPE_NAMES)[number]

export type PrimitiveTypeMap = SatisfiesShape<
  {
    string: string
    number: number
    boolean: boolean
    // eslint-disable-next-line @typescript-eslint/ban-types
    function: Function
    object: object | null
    symbol: symbol
    bigint: bigint
    undefined: undefined
  },
  MakeShape<PrimitiveTypeName>
>

export type ExtendedTypeMap = SatisfiesShape<
  {
    string: string
    number: number
    boolean: boolean
    function: (...args: any[]) => any
    object: {
      readonly [key: string]: unknown
      readonly [index: number]: unknown
      readonly [symbol: symbol]: unknown
    }
    symbol: symbol
    bigint: bigint
    undefined: undefined
    array: readonly unknown[]
    null: null
  },
  MakeShape<ExtendedTypeName>
>
