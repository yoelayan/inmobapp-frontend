export type Estado = {
  latitud?: number
  longitud?: number
  id: number
  nombre: string
  descripcion: string
}
export type Ciudad = {
  latitud?: number
  longitud?: number
  id: number
  nombre: string
  descripcion: string
  estado?: Estado
}
