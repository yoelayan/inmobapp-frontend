
import { type ICharacteristic } from "./RealtstateTypes"
import { type IClient } from "./ClientesTypes"

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
  created_at?: string
  updated_at?: string
}
