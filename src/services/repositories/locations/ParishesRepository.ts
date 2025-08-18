import type { IParish } from '@/types/apps/LocationsTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class ParishesRepository extends BaseRepository<IParish> {
  private static instance: ParishesRepository

  private constructor() {
    super(ENDPOINTS.LOCATIONS.PARISHES.BASE)
  }

  public static getInstance(): ParishesRepository {
    if (!ParishesRepository.instance) {
      ParishesRepository.instance = new ParishesRepository()
    }

    return ParishesRepository.instance
  }
}

export default ParishesRepository.getInstance()
