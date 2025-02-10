import type { Ciudad, Estado } from '@/types/apps/ubigeoTypes'
import type { Franquicia } from '@/types/apps/FranquiciaTypes'

export type SimpleItem = {
  nombre: string
  descripcion: string
  id: number
}

export type ChoiceItem = {
  nombre: string
  id: number
}

export type Propiedad = {
  id: number
  nombre: string
  ciudad: Ciudad
  estado: Estado
  franquicia: Franquicia
  tipo_inmueble: SimpleItem
  precio_usd: string
  first_image_url: string
  visitas_agendadas_count: number
  precio_inicial: string
  precio_alquiler: string
  status_inmueble: SimpleItem
  antiguedad: SimpleItem
  vista: SimpleItem
  amoblado: SimpleItem
  posee_hipoteca: boolean
  family_room: boolean
  cubiculo: boolean
  estudio: boolean
  lavadero: boolean
  terraza_jardin: boolean
  meletero_bodega: boolean
  tanque_agua: boolean
  planta_electrica: boolean
  tanque_agua_comun: boolean
  ascensor: boolean
  seguridad: boolean
  parque_infantil: boolean
  piscina: boolean
  gym: boolean
  bbq: boolean
  salon_fiestas: boolean
  cancha_deportiva: boolean
  pozo_profundo: boolean
  planta_electrica_comun: boolean
  es_favorito: boolean
  descripcion: string
  numero_banios: number
  banio_servicio: number
  medio_banio: null
  habitaciones: number
  hab_servicio: number
  numero_plantas: number
  precio: string
  metros_cuadrados_terreno: string
  metros_cuadrados_construccion: string
  metraje_total: string
  fecha_publicacion: null
  codigo: null
  ptos_estacionamiento: number
  direccion: string
  tipo_negociacion: string
  created_at: string
  cantidad_favoritos: number
  cliente: number
  autor: number
}

export type Asesor = {
  username: null
  email: string
  profile: Profile2
  first_name: string
  last_name: string
  full_name: string
  id: number
}

export type Profile2 = {
  id: number
  nombre: string
  slug_name: string
}

export type Configuraciones = {}
