import type { IRealProperty, IPropertyCharacteristic, ICharacteristic } from '@/types/apps/RealtstateTypes'
import { apiRoutes } from '@api/routes'

import type { ResponseAPI } from '@/api/repositories/BaseRepository'
import BaseRepository from '../BaseRepository'

class PropertyRepository extends BaseRepository<IRealProperty> {
  private static instance: PropertyRepository
  private constructor() {
    super(apiRoutes.realstate.properties)
  }

  public static getInstance(): PropertyRepository {
    if (!PropertyRepository.instance) {
      PropertyRepository.instance = new PropertyRepository()
    }

    return PropertyRepository.instance
  }

  public async getAllImages(id: string): Promise<IRealProperty> {
    const url = apiRoutes.realstate.allImages.replace(':id', id)

    return await this.apiClient.get<IRealProperty>(url)
  }

  public async uploadImages(id: string, files: FileList): Promise<IRealProperty> {
    const url = apiRoutes.realstate.uploadImages.replace(':id', id)

    return await this.apiClient.uploadFile<IRealProperty>(url, files)
  }

  public async deleteImage(id: string): Promise<IRealProperty> {
    const url = apiRoutes.realstate.deleteImage.replace(':id', id)

    return await this.apiClient.delete<IRealProperty>(url)
  }

  public async updateImagesOrder(propertyId: string, images: any[]): Promise<IRealProperty> {
    const url = apiRoutes.realstate.updateImagesOrder.replace(':id', propertyId)

    // Enviamos los datos en el formato que el API espera
    const data = { images_order: images }

    return await this.apiClient.put<IRealProperty>(url, data)
  }

  public async addCharacteristic(id: string, characteristicId: string): Promise<IPropertyCharacteristic> {
    const url = apiRoutes.realstate.addCharacteristic.replace(':id', id)

    return await this.apiClient.post(url, { characteristic_id: characteristicId })
  }

  public async deleteCharacteristic(id: string, characteristicId: string): Promise<IPropertyCharacteristic> {
    const url = apiRoutes.realstate.deleteCharacteristic.replace(':id', id)

    return await this.apiClient.delete(url, { characteristic_id: characteristicId })
  }

  public async updateCharacteristic(
    id: string,
    characteristics: IPropertyCharacteristic[]
  ): Promise<IPropertyCharacteristic> {
    const url = apiRoutes.realstate.updateCharacteristic.replace(':id', id)

    return await this.apiClient.put(url, { characteristics: characteristics })
  }

  public async getPropertyCharacteristics(id: string): Promise<ResponseAPI<IPropertyCharacteristic>> {
    const url = apiRoutes.realstate.getCharacteristics.replace(':id', id)

    return await this.apiClient.get<ResponseAPI<IPropertyCharacteristic>>(url)
  }
  public async allCharacteristics(): Promise<ResponseAPI<ICharacteristic>> {
    const url = apiRoutes.realstate.characteristics

    return await this.apiClient.get<ResponseAPI<ICharacteristic>>(url)
  }
}

export default PropertyRepository.getInstance()
