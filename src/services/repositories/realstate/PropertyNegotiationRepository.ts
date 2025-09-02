import { ENDPOINTS } from '@/services/api/endpoints'

import type { IStatus } from '@/types/apps/CatalogTypes'

import BaseRepository from '../BaseRepository'

class PropertyNegotiationRepository extends BaseRepository<IStatus> {
  private static instance: PropertyNegotiationRepository

  private constructor() {
    super(ENDPOINTS.REALSTATE.TYPE_NEGOTIATIONS.BASE)
  }

  public static getInstance(): PropertyNegotiationRepository {
    if (!PropertyNegotiationRepository.instance) {
      PropertyNegotiationRepository.instance = new PropertyNegotiationRepository()
    }

    return PropertyNegotiationRepository.instance
  }
}

export default PropertyNegotiationRepository.getInstance()
