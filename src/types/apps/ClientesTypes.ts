import type { ICharacteristic } from './RealtstateTypes'
import type { IUser } from './UserTypes'

export interface IClient {
  id?: number
  name: string
  email?: string
  phone?: string
  status?: number
  franchise?: number
  assigned_to?: number
}

export interface ISearch {
  id: number
  description: string
  budget: number
  client_id?: number
  client?: IClient
  characteristics: ISearchCharacteristic[]
  observations: IClientObservation[]
}

export interface ISearchCharacteristic {
  id: number
  search: ISearch
  characteristic: ICharacteristic
  value: string
}

export interface IClientObservation {
  id: number
  created_at: string
  description: string
  author: IUser
  audio: string
}
