import type { City, State } from '@/types/apps/LocationsTypes'
import type { Franquicia } from '@/types/apps/FranquiciaTypes'
import type { Status } from '@/types/apps/CatalogTypes'

export interface TypeNegotiation {
    id: number
    name: string
    code: string
}
export interface Characteristic {
    id: number
    name: string
    code: string
    type_value: string
}
export interface Property {
    id: number
    name: string
    code: string
    description: string
    status: Status
    type_negotiation: TypeNegotiation
    price: number
    initial_price: number
    rent_price: number
    country: Franquicia
    state: State
    city: City
    address: string
}
export interface PropertyCharacteristic {
    id: number
    parent: Property
    characteristic: Characteristic
    value: string
}
export interface PropertyImage {
    id: number
    parent: Property
    image: string
}


