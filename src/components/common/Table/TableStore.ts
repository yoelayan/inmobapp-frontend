// TableStore.ts
import { create } from 'zustand'

import type { ResponseAPI, TableFilterItem, TableSorting, TableState } from './types'

export const createTableStore = <T>(
  fetchFn: (params: {
    page: number
    pageSize: number
    filters: TableFilterItem[]
    sorting: TableSorting[]
  }) => Promise<ResponseAPI<T>>
) => {
  return create<TableState<T>>((set, get) => ({
    data: [],
    loading: false,
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    filters: [],
    sorting: [],

    setData: data => set({ data }),
    setLoading: loading => set({ loading }),
    setPageIndex: pageIndex => set({ pageIndex }),
    setPageSize: pageSize => set({ pageSize }),
    setTotalCount: totalCount => set({ totalCount }),
    setTotalPages: totalPages => set({ totalPages }),
    setFilters: filters => set({ filters }),
    addFilter: filter =>
      set(state => ({
        filters: [...state.filters.filter(f => f.field !== filter.field), filter],
        pageIndex: 0 // Resetear a la primera página al filtrar
      })),
    removeFilter: field =>
      set(state => ({
        filters: state.filters.filter(f => f.field !== field),
        pageIndex: 0 // Resetear a la primera página al quitar filtro
      })),
    setSorting: sorting => set({ sorting }),

    fetchData: async () => {
      const { pageIndex, pageSize, filters, sorting } = get()

      set({ loading: true })

      try {
        const response = await fetchFn({
          page: pageIndex + 1, // API usa base 1
          pageSize,
          filters,
          sorting
        })

        set({
          data: response.results,
          totalCount: response.count,
          totalPages: response.num_pages,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching table data:', error)
        set({ loading: false })
      }
    }
  }))
}
