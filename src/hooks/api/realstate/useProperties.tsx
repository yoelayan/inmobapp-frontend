// React Imports
import { useCallback, useState } from 'react'

// Api Imports
import PropertiesRepository from '@services/repositories/realstate/PropertiesRepository'
import useBaseHookApi from '@hooks/api/useBaseHookApi'

// Type Imports
import type { IPropertyCharacteristic, IRealProperty } from '@/types/apps/RealtstateTypes'
import type { PropertyMetricsFilters } from '@/types/apps/RealtstateMetricsTypes'
import type { FilterItem, ResponseAPI, SortingItem } from '@/types/api/response'

export default function useProperties(defaultFilters?: Record<string, any>) {
  /**
     * uploadImages - detail
      deleteImage - detail
      addCharacteristic - detail
      deleteCharacteristic - detail
      updateCharacteristic - detail
     */

  const baseHookApi = useBaseHookApi(PropertiesRepository, defaultFilters as FilterItem[])
  const { setState } = baseHookApi
  const repository = PropertiesRepository

  const [metricsData, setMetricsData] = useState<any>(null)
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false)
  const [metricsError, setMetricsError] = useState<any>(null)

  const [totalProperties, setTotalProperties] = useState<any>(null)
  const [totalPropertiesLoading, setTotalPropertiesLoading] = useState<boolean>(false)
  const [totalPropertiesError, setTotalPropertiesError] = useState<any>(null)

  const getAllImages = async (id: string | number) => {
    return await PropertiesRepository.getAllImages(Number(id))
  }

  const uploadImages = async (id: string | number, files: FileList) => {
    return await PropertiesRepository.uploadImages(Number(id), files)
  }

  const deleteImage = async (id: string | number) => {
    return await PropertiesRepository.deleteImage(Number(id))
  }

  const updateImagesOrder = async (propertyId: string | number, images: any[]) => {
    // Asegurarnos de que estamos enviando un array de objetos con id y order
    const imagesData = images.map(img => ({
      id: img.id,
      order: img.order
    }))

    return await PropertiesRepository.updateImagesOrder(Number(propertyId), imagesData)
  }

  const addCharacteristic = async (id: string | number, characteristicId: string | number) => {
    return await PropertiesRepository.addCharacteristic(Number(id), Number(characteristicId))
  }

  const deleteCharacteristic = async (id: string | number, characteristicId: string | number) => {
    return await PropertiesRepository.deleteCharacteristic(Number(id), Number(characteristicId))
  }

  const updateCharacteristic = async (id: string | number, characteristics: IPropertyCharacteristic[]) => {
    return await PropertiesRepository.updateCharacteristic(Number(id), characteristics)
  }

  // Obtener todas las caracteristicas
  const getPropertyCharacteristics = async (id: string | number) => {
    return await PropertiesRepository.getPropertyCharacteristics(Number(id))
  }

  const allCharacteristics = async () => {
    return await PropertiesRepository.allCharacteristics()
  }

  const getMetrics = async (filters?: PropertyMetricsFilters) => {
    setMetricsLoading(true)
    setMetricsError(null)

    try {
      const response = await PropertiesRepository.getMetrics(filters)

      setMetricsData(response)

      return response
    } catch (err) {
      setMetricsError(err)

      throw err
    } finally {
      setMetricsLoading(false)
    }
  }

  const getTotalProperties = async () => {
    setTotalPropertiesLoading(true)
    setTotalPropertiesError(null)

    try {
      const response = await PropertiesRepository.getTotalProperties()

      setTotalProperties(response)

      return response
    } catch (err) {
      setTotalPropertiesError(err)

      throw err
    } finally {
      setTotalPropertiesLoading(false)
    }
  }

  const fetchMatchedProperties = useCallback(
    async (
      searchId: number,
      params?: {
        page: number
        pageSize: number
        filters: FilterItem[]
        sorting: SortingItem[]
      }
    ): Promise<ResponseAPI<IRealProperty>> => {
      const { page = 1, pageSize = 10, filters = [], sorting = [] } = params || {}

      setState(prev => ({ ...prev, loading: true }))

      const sortingParams = sorting.reduce(
        (acc: Record<string, string>, item) => {
          acc[`order_by_${item.id}`] = item.desc ? 'desc' : 'asc'

          return acc
        },
        {} as Record<string, string>
      )

      const filtersParams = filters.reduce(
        (acc: Record<string, string>, item) => {
          acc[item.field] = item.value

          return acc
        },
        {} as Record<string, string>
      )

      try {
        const response = await repository.fetchMatchedProperties(searchId, {
          page,
          per_page: pageSize,
          ...filtersParams,
          ...sortingParams
        })

        setState({ data: response, loading: false, error: null, item: null, errors: null })

        return response
      } catch (error) {
        setState(prev => ({ ...prev, loading: false }))
        throw error
      }
    },
    [repository, setState]
  )

  return {
    uploadImages,
    getAllImages,
    deleteImage,
    updateImagesOrder,
    addCharacteristic,
    deleteCharacteristic,
    updateCharacteristic,
    getPropertyCharacteristics,
    allCharacteristics,
    getMetrics,
    getTotalProperties,
    metricsData,
    metricsLoading,
    metricsError,
    totalProperties,
    totalPropertiesLoading,
    totalPropertiesError,
    fetchMatchedProperties,
    ...baseHookApi
  }
}
