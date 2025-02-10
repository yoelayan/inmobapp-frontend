import type { User } from '../../auth/types/UsuarioTypes'

export type MedioContacto = {
  id: number
  tipo_contacto: 'whatsapp' | 'email' | 'instagram'
  valor_contacto: string
}

export type Tipofranquicia = {
  id: number
  nombre: string
  descripcion: string
  slug_name: string
}

export type Franquicia = {
  id: number
  nombre: string
  descripcion?: string
  tipo_franquicia: Tipofranquicia
  usuario_asignado: User
  image: string
  franquicia_master?: number
  franquicia_comercial?: number
  franquicia_personal?: number
  medios_contacto: any[]
}
