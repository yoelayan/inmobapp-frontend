import { useState, useCallback } from 'react'


import type { ResponseAPI, InterfaceRepositoryAPI } from '@/api/repositories/BaseRepository'

type FetchState<T> = {
    data: ResponseAPI<T> | null
    loading: boolean
    error: string | null
    errors: any
    item: T | null
}

export default function useBaseHookApi<T>(
    repository: InterfaceRepositoryAPI<T>,
    defaultFilters?: Record<string, any>
) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null,
        item: null,
        errors: null,
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
                        per_page: 1,
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

                setState({ data: null, loading: false, error: error.message, item: null, errors: error.response.data })
            }
        },
        [repository]
    )

    const updateData = useCallback(
        async (id: string | number, data: Record<string, any>) => {
            setState(prev => ({ ...prev, loading: true, error: null }))

            try {
              const response = await repository.update(id.toString(), data)

                setState({
                    data: {
                        count: 1,
                        page_number: 1,
                        num_pages: 1,
                        per_page: 1,
                        next: null,
                        previous: null,
                        results: [response]
                    },
                    loading: false,
                    error: null,
                    item: response,
                    errors: null,
                })
            } catch (error: any) {
                setState({ data: null, loading: false, error: error.message,
                    item: null, errors: error.response.data
                })
            }
        },
        [repository]
    )

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const response = await repository.getAll(defaultFilters)

            setState({ data: response, loading: false, error: null, item: null, errors: null, })
        } catch (error: any) {
            setState({ data: null, loading: false, error: error.message, item: null, errors: error.response.data })
        }
    }, [repository, defaultFilters])

    const fetchItemById = useCallback(
        async (id: string | number) => {
            setState(prev => ({ ...prev, loading: true, error: null }))

            try {
              const response = await repository.get(id.toString())

                setState({
                    data: {
                        count: 1,
                        page_number: 1,
                        num_pages: 1,
                        per_page: 1,
                        next: null,
                        previous: null,
                        results: [response]
                    },
                    loading: false,
                    error: null,
                    item: response,
                    errors: null,

                })
            } catch (error: any) {
                setState({ data: null, loading: false, error: error.message, item: null, errors: error.response.data })
            }
        },
        [repository]
    )

    const refreshData = useCallback(
        async (filters?: Record<string, any>) => {
            if (state.data) {
                if (defaultFilters) {
                    filters = { ...defaultFilters, ...filters }
                }

                const result = await repository.refresh(filters)

                setState({ data: result, loading: false, error: null, item: null, errors: null, })
            }
        },
        [state.data, defaultFilters, repository]
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
        ...state
    }
}
