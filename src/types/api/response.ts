export type FilterItem = {
  field: string
  value: any
}

export type SortingItem = {
  id: string
  desc: boolean
}

export type ResponseAPI<T> = {
  count: number
  page_number: number
  num_pages: number
  next: string | null
  previous: string | null
  results: T[]
}
