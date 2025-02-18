import type { PropertyType } from '@/types/apps/RealtstateTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class PropertyTypesRepository extends BaseRepository<PropertyType> {
  private static instance: PropertyTypesRepository

  private constructor() {
    super(apiRoutes.realstate.propertyTypes, true)
  }

  public static getInstance(): PropertyTypesRepository {
    if (!PropertyTypesRepository.instance) {
      PropertyTypesRepository.instance = new PropertyTypesRepository()
    }

    
return PropertyTypesRepository.instance
  }
}

export default PropertyTypesRepository.getInstance()
