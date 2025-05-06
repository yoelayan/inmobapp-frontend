import PropertiesRepository from '@/api/repositories/realstate/PropertiesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { IPropertyCharacteristic } from '@/types/apps/RealtstateTypes'

export default function useProperties(defaultFilters?: Record<string, any>) {
  /**
     * uploadImages - detail
      deleteImage - detail
      addCharacteristic - detail
      deleteCharacteristic - detail
      updateCharacteristic - detail
     */

  const {fetchData,
    refreshData,
    getData,
    fetchItemById,
    createData,
    updateData,
    data,
    loading,
    error,
    errors,
    item,
  } = useBaseHookApi(PropertiesRepository, defaultFilters)

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
    }));

    return await PropertiesRepository.updateImagesOrder(propertyId.toString(), imagesData);
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
    data,
    loading,
    error,
    errors,
    item,
  }
}
