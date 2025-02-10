import type { SimpleItem } from '@/types/apps/PropiedadesTypes'
import { propertyTypesApi } from '@/app/api/apps/properties/route'
import BaseRepository from '../BaseRepository'

class PropertyTypesRepository extends BaseRepository<SimpleItem> {
  private static instance: PropertyTypesRepository

  private constructor() {
    super(propertyTypesApi, true)
  }

  public static getInstance(): PropertyTypesRepository {
    if (!PropertyTypesRepository.instance) {
      PropertyTypesRepository.instance = new PropertyTypesRepository()
    }

    
return PropertyTypesRepository.instance
  }
}

export default PropertyTypesRepository.getInstance()
