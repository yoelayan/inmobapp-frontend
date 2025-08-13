import type { IUserGroup } from '@/types/apps/UserTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '@/services/repositories/BaseRepository'

class RolesRepository extends BaseRepository<IUserGroup> {
  private static instance: RolesRepository

  private constructor() {
    super(ENDPOINTS.USERS.ROLES.BASE)
  }

  public static getInstance(): RolesRepository {
    if (!RolesRepository.instance) {
      RolesRepository.instance = new RolesRepository()
    }

    return RolesRepository.instance
  }
}

export default RolesRepository.getInstance()
