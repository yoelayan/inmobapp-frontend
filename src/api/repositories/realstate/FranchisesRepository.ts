import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class FranchisesRepository extends BaseRepository<IFranchise> {
  private static instance: FranchisesRepository

  private constructor() {
    super(apiRoutes.realstate.franchises)
  }

  public static getInstance(): FranchisesRepository {
    if (!FranchisesRepository.instance) {
      FranchisesRepository.instance = new FranchisesRepository()
    }

    return FranchisesRepository.instance
  }
}

export default FranchisesRepository.getInstance()
