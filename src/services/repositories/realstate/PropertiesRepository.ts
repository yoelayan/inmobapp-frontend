import type { ResponseAPI } from '@services/repositories/BaseRepository'

import { ENDPOINTS } from '@/services/api/endpoints'

import type { IRealProperty, IPropertyCharacteristic, ICharacteristic } from '@/types/apps/RealtstateTypes'
import type { PropertyMetricsResponse, PropertyMetricsFilters } from '@/types/apps/RealtstateMetricsTypes'

import BaseRepository from '../BaseRepository'

// Define the interface for total properties response
interface TotalPropertiesResponse {
  results: {
    total_properties: number
    status_counts: {
      active: number
      in_approval: number
      paused: number
      pre_captured: number
      inactive: number
      private: number
      reserved: number
      sold: number
      hook: number
    }
  }
}

class PropertyRepository extends BaseRepository<IRealProperty> {
  private static instance: PropertyRepository
  private constructor() {
    super(ENDPOINTS.REALSTATE.PROPERTIES.BASE)
  }

  public static getInstance(): PropertyRepository {
    if (!PropertyRepository.instance) {
      PropertyRepository.instance = new PropertyRepository()
    }

    return PropertyRepository.instance
  }

  public async getAllImages(id: number): Promise<IRealProperty> {
    const url = ENDPOINTS.REALSTATE.PROPERTIES.IMAGES.ALL(id)

    return await this.apiClient.get<IRealProperty>(url)
  }

  public async uploadImages(id: number, files: FileList): Promise<IRealProperty> {
    const url = ENDPOINTS.REALSTATE.PROPERTIES.IMAGES.UPLOAD(id)

    return await this.apiClient.uploadFile<IRealProperty>(url, files)
  }

  public async deleteImage(id: number): Promise<IRealProperty> {
    const url = ENDPOINTS.REALSTATE.PROPERTIES.IMAGES.DELETE(id)

    return await this.apiClient.delete<IRealProperty>(url)
  }

  public async updateImagesOrder(propertyId: number, images: any[]): Promise<IRealProperty> {
    const url = ENDPOINTS.REALSTATE.PROPERTIES.IMAGES.REORDER(propertyId)

    // Enviamos los datos en el formato que el API espera
    const data = { images_order: images }

    return await this.apiClient.put<IRealProperty>(url, data)
  }

  public async addCharacteristic(id: number, characteristicId: number): Promise<IPropertyCharacteristic> {
    const url = ENDPOINTS.REALSTATE.PROPERTIES.CHARACTERISTICS.ADD(id)

    return await this.apiClient.post(url, { characteristic_id: characteristicId })
  }

  public async deleteCharacteristic(id: number, characteristicId: number): Promise<IPropertyCharacteristic> {
    const url = ENDPOINTS.REALSTATE.PROPERTIES.CHARACTERISTICS.DELETE(id)

    return await this.apiClient.delete(url, { characteristic_id: characteristicId })
  }

  public async updateCharacteristic(
    id: number,
    characteristics: IPropertyCharacteristic[]
  ): Promise<IPropertyCharacteristic> {
    const url = ENDPOINTS.REALSTATE.PROPERTIES.CHARACTERISTICS.UPDATE(id)

    return await this.apiClient.put(url, { characteristics: characteristics })
  }

  public async getPropertyCharacteristics(id: number): Promise<ResponseAPI<IPropertyCharacteristic>> {
    const url = ENDPOINTS.REALSTATE.PROPERTIES.CHARACTERISTICS.BASE(id)

    return await this.apiClient.get<ResponseAPI<IPropertyCharacteristic>>(url)
  }

  public async allCharacteristics(): Promise<ResponseAPI<ICharacteristic>> {
    const url = ENDPOINTS.REALSTATE.PROPERTY_CHARACTERISTICS.BASE

    return await this.apiClient.get<ResponseAPI<ICharacteristic>>(url)
  }

  public async getMetrics(filters?: PropertyMetricsFilters): Promise<PropertyMetricsResponse> {
    return await this.apiClient.get<PropertyMetricsResponse>(ENDPOINTS.REALSTATE.PROPERTIES.METRICS, filters)
  }

  public async getTotalProperties(): Promise<TotalPropertiesResponse> {
    return await this.apiClient.get<TotalPropertiesResponse>(ENDPOINTS.REALSTATE.PROPERTIES.TOTAL)
  }
}

export default PropertyRepository.getInstance()
