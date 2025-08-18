import type { IGeoItem } from '@/types/apps/LocationsTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class CitiesRepository extends BaseRepository<IGeoItem> {
  private static instance: CitiesRepository

  private constructor() {
    super(ENDPOINTS.LOCATIONS.CITIES.BASE)
  }

  public static getInstance(): CitiesRepository {
    if (!CitiesRepository.instance) {
      CitiesRepository.instance = new CitiesRepository()
    }

    return CitiesRepository.instance
  }
}

export default CitiesRepository.getInstance()
