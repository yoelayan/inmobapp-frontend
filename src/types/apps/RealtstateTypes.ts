import type { GeoItem } from '@/types/apps/LocationsTypes'
import type { Franquicia } from '@/types/apps/FranquiciaTypes'
import type { Status } from '@/types/apps/CatalogTypes'

export interface TypeNegotiation {
    id: number
    name: string
    code: string
}
export interface PropertyType {
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
export interface RealProperty {
    id: number
    name: string
    code: string
    description: string
    property_type: PropertyType
    status: Status
    type_negotiation: TypeNegotiation
    price: number
    initial_price: number
    rent_price: number
    country: Franquicia
    state: GeoItem
    city: GeoItem
    address: string
}
export interface PropertyCharacteristic {
    id: number
    parent: RealProperty
    characteristic: Characteristic
    value: string
}
export interface PropertyImage {
    id: number
    parent: RealProperty
    image: string
}


