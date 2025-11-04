
import { type ICharacteristic } from "./RealtstateTypes"

export type ISearchCharacteristic = {
  value: string
  id: number
  characteristic: ICharacteristic
}

export type ISearch = {
  id?: number
  description: string
  budget: number
  client_id: number
  state_id: number | null
  municipality_id: number | null
  parish_id: number | null
}
