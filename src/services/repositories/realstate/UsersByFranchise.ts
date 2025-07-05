import type { IUser } from '@/types/apps/UserTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class UsersByFranchiseRepository extends BaseRepository<IUser> {
  private static instance: UsersByFranchiseRepository

  private constructor() {
    super(ENDPOINTS.REALSTATE.USERS_BY_FRANCHISE.BASE)
  }

  public static getInstance(): UsersByFranchiseRepository {
    if (!UsersByFranchiseRepository.instance) {
      UsersByFranchiseRepository.instance = new UsersByFranchiseRepository()
    }

    return UsersByFranchiseRepository.instance
  }
}

export default UsersByFranchiseRepository.getInstance()
