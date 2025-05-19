import type { IGeoItem } from '@/types/apps/LocationsTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class StatesRepository extends BaseRepository<IGeoItem> {
  private static instance: StatesRepository

  private constructor() {
    super(apiRoutes.locations.states, true)
  }

  public static getInstance(): StatesRepository {
    if (!StatesRepository.instance) {
      StatesRepository.instance = new StatesRepository()
    }

    return StatesRepository.instance
  }
}

export default StatesRepository.getInstance()
