import type { SimpleItem } from '@/types/apps/PropiedadesTypes'
import { propertyStatusApi } from '@/app/api/apps/properties/route'
import BaseRepository from '../BaseRepository'

class PropertyStatusRepository extends BaseRepository<SimpleItem> {
  private static instance: PropertyStatusRepository

  private constructor() {
    super(propertyStatusApi, true)
  }

  public static getInstance(): PropertyStatusRepository {
    if (!PropertyStatusRepository.instance) {
      PropertyStatusRepository.instance = new PropertyStatusRepository()
    }

    
return PropertyStatusRepository.instance
  }
}

export default PropertyStatusRepository.getInstance()
