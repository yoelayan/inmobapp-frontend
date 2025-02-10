export type Profile = {
  id: number
  descripcion: string
  nombre: string
  codigo: string
  slug_name: string
  keys: any[]
}

export type Contacto = {
  tipo: number
  valor: string
}

export type User = {
  username: null
  email: string
  profile: Profile
  first_name: string
  last_name: string
  full_name: string
  id: number
  accessTokenExpiresTimestamp: number
  first_image_url: string
  contactos: Contacto[]
}
