import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class FranchisesRepository extends BaseRepository<IFranchise> {
  private static instance: FranchisesRepository

  private constructor() {
    super(ENDPOINTS.REALSTATE.FRANCHISES.BASE)
  }

  public static getInstance(): FranchisesRepository {
    if (!FranchisesRepository.instance) {
      FranchisesRepository.instance = new FranchisesRepository()
    }

    return FranchisesRepository.instance
  }
}

export default FranchisesRepository.getInstance()
