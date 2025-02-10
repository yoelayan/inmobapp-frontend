import type { SimpleItem } from '@/types/apps/PropiedadesTypes'
import { propertyAlternativesApi } from '@/app/api/apps/properties/route'
import BaseRepository from '../BaseRepository'

class PropertyNegotiationRepository extends BaseRepository<SimpleItem> {
  private static instance: PropertyNegotiationRepository

  private constructor() {
    super(propertyAlternativesApi, true)
  }

  public static getInstance(): PropertyNegotiationRepository {
    if (!PropertyNegotiationRepository.instance) {
      PropertyNegotiationRepository.instance = new PropertyNegotiationRepository()
    }

    
return PropertyNegotiationRepository.instance
  }
}

export default PropertyNegotiationRepository.getInstance()
