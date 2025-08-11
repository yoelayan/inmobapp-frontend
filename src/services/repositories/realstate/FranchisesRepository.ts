import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'
import type { ResponseAPI } from '@/types/api/response'

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

  public getValidParents(franchiseId: number): Promise<ResponseAPI<IFranchise>> {
    return this.apiClient.get<ResponseAPI<IFranchise>>(`${this.base_url}${franchiseId}/valid-parents/`)
  }
}

export default FranchisesRepository.getInstance()
