// TableStore.ts
import { create } from 'zustand'

import type { TableState } from './types'
import type { FilterItem, ResponseAPI, SortingItem } from '@/types/api/response'

export const createTableStore = <T>(params: {
  data: ResponseAPI<T>,
  loading: boolean,
  refresh: (params: { page: number, pageSize: number, filters: FilterItem[], sorting: SortingItem[] }) => Promise<ResponseAPI<T>>
}) => {
  // Safely destructure with fallback values to prevent SSR errors
  const { results = [], count = 0, num_pages = 1, page_number = 1 } = params.data || {}

  return create<TableState<T>>((set, get) => ({
    data: results,
    loading: params.loading,
    pageIndex: (page_number || 1) - 1,
    pageSize: 10,
    totalCount: count,
    totalPages: num_pages || 1,
    filters: [],
    sorting: [],

    setData: data => set({ data }),
    setLoading: loading => set({ loading }),
    setPageIndex: pageIndex => set({ pageIndex }),
    setPageSize: pageSize => set({ pageSize }),
    setTotalCount: totalCount => set({ totalCount }),
    setTotalPages: totalPages => set({ totalPages }),
    setFilters: filters => set({ filters }),
    addFilter: filter => {
      set(state => ({
        filters: [...state.filters.filter(f => f.field !== filter.field), filter],
        pageIndex: 0
      }))
      setTimeout(() => get().fetchData(), 0)
    },
    removeFilter: field => {
      set(state => ({
        filters: state.filters.filter(f => f.field !== field),
        pageIndex: 0
      }))
      setTimeout(() => get().fetchData(), 0)
    },
    setSorting: sorting => set({ sorting }),
    addSorting: sorting => set({ sorting: [...get().sorting, sorting] }),

    fetchData: async () => {
      const { pageIndex, pageSize, filters, sorting } = get()

      set({ loading: true })

      try {
        const response = await params.refresh({
          page: pageIndex + 1,
          pageSize,
          filters,
          sorting
        })

        set({
          data: response.results,
          totalCount: response.count,
          totalPages: response.num_pages,
          pageIndex: (response.page_number || 1) - 1,
          loading: false,
        })

      } catch (error) {
        console.error('Error fetching table data:', error)
        set({ loading: false })
      }
    }
  }))
}
