import type { RealProperty } from '@/types/apps/RealtstateTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class PropertyRepository extends BaseRepository<RealProperty> {
  private static instance: PropertyRepository

  private constructor() {
    super(apiRoutes.realstate.properties)
  }

  public static getInstance(): PropertyRepository {
    if (!PropertyRepository.instance) {
      PropertyRepository.instance = new PropertyRepository()
    }

    
return PropertyRepository.instance
  }
}

export default PropertyRepository.getInstance()
