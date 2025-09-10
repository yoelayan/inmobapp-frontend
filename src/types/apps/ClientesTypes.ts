
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

export interface IClientObservation {
  id: number
  created_at: string
  description: string
  author: IUser
  audio: string
}
