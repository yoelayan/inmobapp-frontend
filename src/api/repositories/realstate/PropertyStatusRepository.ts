import type { Status } from '@/types/apps/CatalogTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class PropertyStatusRepository extends BaseRepository<Status> {
  private static instance: PropertyStatusRepository

  private constructor() {
    super(apiRoutes.realstate.propertyStatus, true)
  }

  public static getInstance(): PropertyStatusRepository {
    if (!PropertyStatusRepository.instance) {
      PropertyStatusRepository.instance = new PropertyStatusRepository()
    }

    return PropertyStatusRepository.instance
  }
}

export default PropertyStatusRepository.getInstance()
