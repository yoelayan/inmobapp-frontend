import type { IStatus } from '@/types/apps/CatalogTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class PropertyStatusRepository extends BaseRepository<IStatus> {
  private static instance: PropertyStatusRepository

  private constructor() {
    super(ENDPOINTS.REALSTATE.PROPERTY_STATUS.BASE)
  }

  public static getInstance(): PropertyStatusRepository {
    if (!PropertyStatusRepository.instance) {
      PropertyStatusRepository.instance = new PropertyStatusRepository()
    }

    return PropertyStatusRepository.instance
  }
}

export default PropertyStatusRepository.getInstance()
