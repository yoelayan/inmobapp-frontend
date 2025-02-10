import type { Propiedad } from '@/types/apps/PropiedadesTypes'
import { propertiesApi } from '@/app/api/apps/properties/route'
import BaseRepository from '../BaseRepository'

class PropertyRepository extends BaseRepository<Propiedad> {
  private static instance: PropertyRepository

  private constructor() {
    super(propertiesApi)
  }

  public static getInstance(): PropertyRepository {
    if (!PropertyRepository.instance) {
      PropertyRepository.instance = new PropertyRepository()
    }

    
return PropertyRepository.instance
  }
}

export default PropertyRepository.getInstance()
