// React Imports
import { useState } from 'react'

// Api Imports
import PropertiesRepository from '@/api/repositories/realstate/PropertiesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

// Type Imports
import type { IPropertyCharacteristic } from '@/types/apps/RealtstateTypes'
import type { PropertyMetricsFilters } from '@/types/apps/RealtstateMetricsTypes'

export default function useProperties(defaultFilters?: Record<string, any>) {
  /**
     * uploadImages - detail
      deleteImage - detail
      addCharacteristic - detail
      deleteCharacteristic - detail
      updateCharacteristic - detail
     */

  const { fetchData, refreshData, getData, fetchItemById, createData, updateData, data, loading, error, errors, item } =
    useBaseHookApi(PropertiesRepository, defaultFilters)

  const [metricsData, setMetricsData] = useState<any>(null)
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false)
  const [metricsError, setMetricsError] = useState<any>(null)

  const [totalProperties, setTotalProperties] = useState<any>(null)
  const [totalPropertiesLoading, setTotalPropertiesLoading] = useState<boolean>(false)
  const [totalPropertiesError, setTotalPropertiesError] = useState<any>(null)

  const getAllImages = async (id: string | number) => {
    return await PropertiesRepository.getAllImages(id.toString())
  }

  const uploadImages = async (id: string | number, files: FileList) => {
    return await PropertiesRepository.uploadImages(id.toString(), files)
  }

  const deleteImage = async (id: string | number) => {
    return await PropertiesRepository.deleteImage(id.toString())
  }

  const updateImagesOrder = async (propertyId: string | number, images: any[]) => {
    // Asegurarnos de que estamos enviando un array de objetos con id y order
    const imagesData = images.map(img => ({
      id: img.id,
      order: img.order
    }))

    return await PropertiesRepository.updateImagesOrder(propertyId.toString(), imagesData)
  }

  const addCharacteristic = async (id: string | number, characteristicId: string | number) => {
    return await PropertiesRepository.addCharacteristic(id.toString(), characteristicId.toString())
  }

  const deleteCharacteristic = async (id: string | number, characteristicId: string | number) => {
    return await PropertiesRepository.deleteCharacteristic(id.toString(), characteristicId.toString())
  }

  const updateCharacteristic = async (id: string | number, characteristics: IPropertyCharacteristic[]) => {
    return await PropertiesRepository.updateCharacteristic(id.toString(), characteristics)
  }

  // Obtener todas las caracteristicas
  const getPropertyCharacteristics = async (id: string | number) => {
    return await PropertiesRepository.getPropertyCharacteristics(id.toString())
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

  return {
    uploadImages,
    getAllImages,
    deleteImage,
    updateImagesOrder,
    addCharacteristic,
    deleteCharacteristic,
    updateCharacteristic,
    getPropertyCharacteristics,
    fetchData,
    refreshData,
    getData,
    fetchItemById,
    allCharacteristics,
    createData,
    updateData,
    getMetrics,
    getTotalProperties,
    data,
    loading,
    error,
    errors,
    item,
    metricsData,
    metricsLoading,
    metricsError,
    totalProperties,
    totalPropertiesLoading,
    totalPropertiesError
  }
}
