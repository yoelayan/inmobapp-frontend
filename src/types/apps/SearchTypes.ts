
import { type ICharacteristic } from "./RealtstateTypes"
import { type IClient } from "./ClientesTypes"
import type { IState, IMunicipality, IParish } from "./LocationsTypes"

export type ISearchCharacteristic = {
  value: string
  id: number
  characteristic: ICharacteristic
}

export type ISearch = {
  description: string
  id?: number
  budget: number
  client_id: number
  client?: IClient
  status_id?: number
  user_id?: number
  franchise_id?: number
  state_id?: number | null
  municipality_id?: number | null
  parish_id?: number | null
  state?: IState
  municipality?: IMunicipality
  parish?: IParish
  created_at?: string
  updated_at?: string
}
