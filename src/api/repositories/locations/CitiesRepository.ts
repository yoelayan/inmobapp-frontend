import type { IGeoItem } from '@/types/apps/LocationsTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class CitiesRepository extends BaseRepository<IGeoItem> {
  private static instance: CitiesRepository

  private constructor() {
    super(apiRoutes.locations.cities, true)
  }

  public static getInstance(): CitiesRepository {
    if (!CitiesRepository.instance) {
      CitiesRepository.instance = new CitiesRepository()
    }


    return CitiesRepository.instance
  }
}

export default CitiesRepository.getInstance()
