import type { ContactoCliente } from './ContactoClienteTypes'
import type { Franquicia } from './FranquiciaTypes'


export type ClienteStatus = {
  id: number
  nombre: string
}

export type Cliente = {
  id: number
  nombre: string
  email: StringConstructor
  status: ClienteStatus
  created_at: string
}
