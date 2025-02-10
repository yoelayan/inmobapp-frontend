import type { SimpleItem } from '@/types/apps/PropiedadesTypes'
import { propertyViewApi } from '@/app/api/apps/properties/route'
import BaseRepository from '../BaseRepository'

class PropertyViwRepository extends BaseRepository<SimpleItem> {
  private static instance: PropertyViwRepository

  private constructor() {
    super(propertyViewApi, true)
  }

  public static getInstance(): PropertyViwRepository {
    if (!PropertyViwRepository.instance) {
      PropertyViwRepository.instance = new PropertyViwRepository()
    }

    
return PropertyViwRepository.instance
  }
}

export default PropertyViwRepository.getInstance()
