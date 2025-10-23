import type { IMembership } from '@/types/apps/MembershipTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '@services/repositories/BaseRepository'

import type { ResponseAPI } from '@/types/api/response'

class MembershipsRepository extends BaseRepository<IMembership> {
  private static instance: MembershipsRepository = new MembershipsRepository()

  private constructor() {
    super(ENDPOINTS.MEMBERSHIPS.BASE)
  }

  public static getInstance(): MembershipsRepository {
    if (!MembershipsRepository.instance) {
      MembershipsRepository.instance = new MembershipsRepository()
    }

    return MembershipsRepository.instance
  }

  async getMembershipById(id: number): Promise<ResponseAPI<IMembership>> {
    return await this.apiClient.get<ResponseAPI<IMembership>>(ENDPOINTS.MEMBERSHIPS.BY_ID(id))
  }
}

export default MembershipsRepository.getInstance()