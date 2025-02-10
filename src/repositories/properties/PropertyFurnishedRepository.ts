import type { SimpleItem } from '@/types/apps/PropiedadesTypes'
import { propertyFurnishedApi } from '@/app/api/apps/properties/route'
import BaseRepository from '../BaseRepository'

class PropertyNegotiationRepository extends BaseRepository<SimpleItem> {
  private static instance: PropertyNegotiationRepository

  private constructor() {
    super(propertyFurnishedApi, true)
  }

  public static getInstance(): PropertyNegotiationRepository {
    if (!PropertyNegotiationRepository.instance) {
      PropertyNegotiationRepository.instance = new PropertyNegotiationRepository()
    }

    
return PropertyNegotiationRepository.instance
  }
}

export default PropertyNegotiationRepository.getInstance()
