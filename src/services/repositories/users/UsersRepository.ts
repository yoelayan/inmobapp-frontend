import type { IUser } from '@/types/apps/UserTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository, { type ResponseAPI } from '../BaseRepository'

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
}

export default UsersRepository.getInstance()
