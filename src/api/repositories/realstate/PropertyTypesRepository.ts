import type { IStatus } from '@/types/apps/CatalogTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class PropertyTypesRepository extends BaseRepository<IStatus> {
  private static instance: PropertyTypesRepository

  private constructor() {
    super(apiRoutes.realstate.propertyTypes, false)
  }

  public static getInstance(): PropertyTypesRepository {
    if (!PropertyTypesRepository.instance) {
      PropertyTypesRepository.instance = new PropertyTypesRepository()
    }

    return PropertyTypesRepository.instance
  }
}

export default PropertyTypesRepository.getInstance()
