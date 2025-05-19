import type { IStatus } from '@/types/apps/CatalogTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class PropertyNegotiationRepository extends BaseRepository<IStatus> {
  private static instance: PropertyNegotiationRepository

  private constructor() {
    super(apiRoutes.realstate.typeNegotiations, true)
  }

  public static getInstance(): PropertyNegotiationRepository {
    if (!PropertyNegotiationRepository.instance) {
      PropertyNegotiationRepository.instance = new PropertyNegotiationRepository()
    }

    return PropertyNegotiationRepository.instance
  }
}

export default PropertyNegotiationRepository.getInstance()
