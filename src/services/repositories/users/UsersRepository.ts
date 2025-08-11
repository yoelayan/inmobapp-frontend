import type { IUserGroup, IUser } from '@/types/apps/UserTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '@services/repositories/BaseRepository'

import type { ResponseAPI } from '@/types/api/response'

class UsersRepository extends BaseRepository<IUser> {
  private static instance: UsersRepository

  private constructor() {
    super(ENDPOINTS.USERS.BASE)
  }

  public static getInstance(): UsersRepository {
    if (!UsersRepository.instance) {
      UsersRepository.instance = new UsersRepository()
    }

    return UsersRepository.instance
  }

  async getUsersByFranchise(franchiseId: number): Promise<ResponseAPI<IUser>> {
    return await this.apiClient.get<ResponseAPI<IUser>>(ENDPOINTS.USERS.BY_FRANCHISE(franchiseId))
  }

  async getGroups(): Promise<ResponseAPI<IUserGroup>> {
    return await this.apiClient.get<ResponseAPI<IUserGroup>>(ENDPOINTS.USERS.GROUPS.BASE)
  }
}

export default UsersRepository.getInstance()
