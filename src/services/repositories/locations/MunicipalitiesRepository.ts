import type { IMunicipality } from '@/types/apps/LocationsTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class MunicipalitiesRepository extends BaseRepository<IMunicipality> {
  private static instance: MunicipalitiesRepository

  private constructor() {
    super(ENDPOINTS.LOCATIONS.MUNICIPALITIES.BASE)
  }

  public static getInstance(): MunicipalitiesRepository {
    if (!MunicipalitiesRepository.instance) {
      MunicipalitiesRepository.instance = new MunicipalitiesRepository()
    }

    return MunicipalitiesRepository.instance
  }
}

export default MunicipalitiesRepository.getInstance()
