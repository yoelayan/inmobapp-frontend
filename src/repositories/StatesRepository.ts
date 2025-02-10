import type { Estado } from '@/types/apps/ubigeoTypes'
import { statesApi } from '@/app/api/apps/ubigeo/route'
import BaseRepository from './BaseRepository'

class StatesRepository extends BaseRepository<Estado> {
  private static instance: StatesRepository

  private constructor() {
    super(statesApi, true)
  }

  public static getInstance(): StatesRepository {
    if (!StatesRepository.instance) {
      StatesRepository.instance = new StatesRepository()
    }

    
return StatesRepository.instance
  }
}

export default StatesRepository.getInstance()
