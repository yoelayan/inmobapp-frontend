import type { IGeoItem } from '@/types/apps/LocationsTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class StatesRepository extends BaseRepository<IGeoItem> {
  private static instance: StatesRepository

  private constructor() {
    super(ENDPOINTS.LOCATIONS.STATES.BASE, true)
  }

  public static getInstance(): StatesRepository {
    if (!StatesRepository.instance) {
      StatesRepository.instance = new StatesRepository()
    }

    return StatesRepository.instance
  }
}

export default StatesRepository.getInstance()
