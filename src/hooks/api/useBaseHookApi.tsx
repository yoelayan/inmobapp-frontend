import { useState, useCallback } from 'react'

import type { InterfaceRepositoryAPI } from '@/services/repositories/BaseRepository'
import type { FilterItem, SortingItem, ResponseAPI } from '@/types/api/response'

type FetchState<T> = {
  data: ResponseAPI<T>
  loading: boolean
  error: string | null
  errors: any
  item: T | null
}

const defaultResponseAPI: ResponseAPI<any> = {
  count: 0,
  page_number: 1,
  num_pages: 0,
  next: null,
  previous: null,
  results: []
}

export default function useBaseHookApi<T>(repository: InterfaceRepositoryAPI<T>, defaultFilters?: FilterItem[]) {
  const [state, setState] = useState<FetchState<T>>({
    data: defaultResponseAPI,
    loading: true,
    error: null,
    item: null,
    errors: null
  })

  const createData = useCallback(
    async (data: Record<string, any>) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const response = await repository.create(data)

        setState({
          data: {
            count: 1,
            page_number: 1,
            num_pages: 1,
            next: null,
            previous: null,
            results: [response]
          },
          loading: false,
          error: null,
          errors: null,
          item: response
        })
      } catch (error: any) {
        console.log(error)

        setState({ data: defaultResponseAPI, loading: false, error: error.message, item: null, errors: error.response.data })
      }
    },
    [repository]
  )

  const updateData = useCallback(
    async (id: string | number, data: Record<string, any>) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const response = await repository.update(Number(id), data)

        setState({
          data: {
            count: 1,
            page_number: 1,
            num_pages: 1,
            next: null,
            previous: null,
            results: [response]
          },
          loading: false,
          error: null,
          item: response,
          errors: null
        })
      } catch (error: any) {
        setState({ data: defaultResponseAPI, loading: false, error: error.message, item: null, errors: error.response.data })
      }
    },
    [repository]
  )

  const fetchData = useCallback(async (params?: { page: number, pageSize: number, filters: FilterItem[], sorting: SortingItem[] }): Promise<ResponseAPI<T>> => {
    const { page = 1, pageSize = 10, filters = [], sorting = [] } = params || {}

    setState(prev => ({ ...prev, loading: true, error: null }))

    const sortingParams = sorting.reduce((acc: Record<string, string>, item) => {
      acc[`order_by_${item.id}`] = item.desc ? 'desc' : 'asc'

      return acc
    }, {} as Record<string, string>)

    const filtersParams = filters.reduce((acc: Record<string, string>, item) => {
      acc[item.field] = item.value

      return acc
    }, {} as Record<string, string>)

    try {
      const response = await repository.getAll({ page, per_page: pageSize, ...filtersParams, ...sortingParams })

      setState({ data: response, loading: false, error: null, item: null, errors: null })

      return response
    } catch (error: any) {
      setState({ data: defaultResponseAPI, loading: false, error: error.message, item: null, errors: error.response.data })

      return defaultResponseAPI
    }
  }, [repository])

  const fetchItemById = useCallback(
    async (id: string | number) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const response = await repository.get(Number(id))

        setState({
          data: {
            count: 1,
            page_number: 1,
            num_pages: 1,
            next: null,
            previous: null,
            results: [response]
          },
          loading: false,
          error: null,
          item: response,
          errors: null
        })
      } catch (error: any) {
        setState({ data: defaultResponseAPI, loading: false, error: error.message, item: null, errors: error.response.data })
      }
    },
    [repository]
  )

  const refreshData = useCallback(
    async (filters?: FilterItem[]) => {
      setState(prev => ({ ...prev, loading: true }))

      try {
        if (defaultFilters) {
          filters = { ...defaultFilters, ...filters }
        }

        const result = await repository.refresh(filters)

        setState({
          data: result,
          loading: false,
          error: null,
          item: null,
          errors: null
        })
      } catch (error: any) {
        setState({
          data: state.data,
          loading: false,
          error: error.message,
          item: null,
          errors: error.response?.data || null
        })
      }
    },
    [repository, defaultFilters, state.data]
  )

  const deleteData = useCallback(
    async (id: string | number) => {
      setState(prev => ({ ...prev, loading: true }))

      try {
        await repository.delete(Number(id))

        setState({ data: defaultResponseAPI, loading: false, error: null, item: null, errors: null })
      } catch (error: any) {

        setState({ data: defaultResponseAPI, loading: false, error: error.message, item: null, errors: error.response.data })
        throw error
      }
    },
    [repository]
  )

  const getData = useCallback(() => {
    return state.data
  }, [state.data])

  return {
    fetchData,
    refreshData,
    getData,
    fetchItemById,
    createData,
    updateData,
    deleteData,
    ...state
  }
}
