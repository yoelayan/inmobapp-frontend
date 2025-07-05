import type { IStatus } from '@/types/apps/CatalogTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class PropertyTypesRepository extends BaseRepository<IStatus> {
  private static instance: PropertyTypesRepository

  private constructor() {
    super(ENDPOINTS.REALSTATE.PROPERTY_TYPES.BASE, false)
  }

  public static getInstance(): PropertyTypesRepository {
    if (!PropertyTypesRepository.instance) {
      PropertyTypesRepository.instance = new PropertyTypesRepository()
    }

    return PropertyTypesRepository.instance
  }
}

export default PropertyTypesRepository.getInstance()
