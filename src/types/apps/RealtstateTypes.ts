import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import type { IUser } from '@/types/apps/UserTypes'
import type { IGeoItem } from '@/types/apps/LocationsTypes'
import type { IClient } from './ClientesTypes'
import type { IStatus } from './CatalogTypes'

export interface IRealProperty {
  id: number
  created_by?: IUser
  updated_by?: IUser
  assigned_to?: IUser
  created_at?: string
  updated_at?: string
  status: string
  name: string
  description: string
  characteristics: IPropertyCharacteristic[]
  code: string
  price: number
  initial_price: number
  rent_price: number
  address: string
  images: IImage[]
  first_image_url: string
  type_negotiation: IStatus
  type_property: IStatus
  state: IGeoItem
  city: IGeoItem
  franchise?: IFranchise
  franchise_id: number
  type_negotiation_id: number
  type_property_id: number
  state_id: number
  city_id: number
  status_id: number
  assigned_to_id: number
  owner: IClient
  owner_id: number
}

export interface IImage {
  id: number
  image?: string
  order: number
  preview?: Blob | MediaSource
}

export interface ICharacteristic {
  code: string
  id: number
  name: string
  type_value: string
  is_required: boolean
}

export interface IPropertyCharacteristic {
  id: number
  value: boolean | number | string
  characteristic: ICharacteristic
}
