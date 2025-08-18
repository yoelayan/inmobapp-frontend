import type { IState } from '@/types/apps/LocationsTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class StatesRepository extends BaseRepository<IState> {
  private static instance: StatesRepository

  private constructor() {
    super(ENDPOINTS.LOCATIONS.STATES.BASE)
  }

  public static getInstance(): StatesRepository {
    if (!StatesRepository.instance) {
      StatesRepository.instance = new StatesRepository()
    }

    return StatesRepository.instance
  }
}

export default StatesRepository.getInstance()
