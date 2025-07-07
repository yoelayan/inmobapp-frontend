export type TableFilterItem = {
  field: string
  value: any
}

export type TableSorting = {
  id: string
  desc: boolean
}

export type ResponseAPI<T> = {
  count: number
  page_number: number
  num_pages: number
  per_page: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface TableState<T> {

  // Estado
  data: T[]
  loading: boolean
  pageIndex: number
  pageSize: number
  totalCount: number
  totalPages: number
  filters: TableFilterItem[]
  sorting: TableSorting[]

  // Acciones
  setData: (data: T[]) => void
  setLoading: (loading: boolean) => void
  setPageIndex: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
  setTotalCount: (totalCount: number) => void
  setTotalPages: (totalPages: number) => void
  setFilters: (filters: TableFilterItem[]) => void
  addFilter: (filter: TableFilterItem) => void
  removeFilter: (field: string) => void
  setSorting: (sorting: TableSorting[]) => void
  fetchData: () => Promise<void>
}
