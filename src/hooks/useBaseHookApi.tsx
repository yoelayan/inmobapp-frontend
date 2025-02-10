import { useState, useCallback } from 'react'

import type { ResponseAPI, InterfaceRepositoryAPI } from '@/repositories/BaseRepository'

type FetchState<T> = {
    data: ResponseAPI<T> | null
    loading: boolean
    error: string | null
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
        item: null
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
                    item: response
                })
            } catch (error: any) {
                setState({ data: null, loading: false, error: error.message, item: null })
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
                    item: response
                })
            } catch (error: any) {
                setState({ data: null, loading: false, error: error.message,
                    item: null
                })
            }
        },
        [repository]
    )

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            const response = await repository.getAll(defaultFilters)

            setState({ data: response, loading: false, error: null, item: null })
        } catch (error: any) {
            setState({ data: null, loading: false, error: error.message, item: null })
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
                    item: response
                })
            } catch (error: any) {
                setState({ data: null, loading: false, error: error.message, item: null })
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

                setState({ data: result, loading: false, error: null, item: null })
            }
        },
        [state.data, fetchData]
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
