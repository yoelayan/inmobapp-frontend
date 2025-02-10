import type { Franquicia } from '@/types/apps/FranquiciaTypes'
import { franchisesApi } from '@/app/api/apps/franchises/route'
import BaseRepository from './BaseRepository'

class FranchisesRepository extends BaseRepository<Franquicia> {
  private static instance: FranchisesRepository

  private constructor() {
    super(franchisesApi)
  }

  public static getInstance(): FranchisesRepository {
    if (!FranchisesRepository.instance) {
      FranchisesRepository.instance = new FranchisesRepository()
    }

    
return FranchisesRepository.instance
  }
}

export default FranchisesRepository.getInstance()
