import type { Ciudad } from '@/types/apps/ubigeoTypes'
import { citiesApi } from '@/app/api/apps/ubigeo/route'
import BaseRepository from './BaseRepository'

class CitiesRepository extends BaseRepository<Ciudad> {
  private static instance: CitiesRepository

  private constructor() {
    super(citiesApi, true)
  }

  public static getInstance(): CitiesRepository {
    if (!CitiesRepository.instance) {
      CitiesRepository.instance = new CitiesRepository()
    }

    
return CitiesRepository.instance
  }
}

export default CitiesRepository.getInstance()
