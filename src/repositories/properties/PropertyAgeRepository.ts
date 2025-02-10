import type { SimpleItem } from '@/types/apps/PropiedadesTypes'
import { propertyAgeApi } from '@/app/api/apps/properties/route'
import BaseRepository from '../BaseRepository'

class PropertyNegotiationRepository extends BaseRepository<SimpleItem> {
  private static instance: PropertyNegotiationRepository

  private constructor() {
    super(propertyAgeApi, true)
  }

  public static getInstance(): PropertyNegotiationRepository {
    if (!PropertyNegotiationRepository.instance) {
      PropertyNegotiationRepository.instance = new PropertyNegotiationRepository()
    }

    
return PropertyNegotiationRepository.instance
  }
}

export default PropertyNegotiationRepository.getInstance()
