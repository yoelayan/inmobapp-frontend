import type { IUser } from '@/types/apps/UserTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class UsersByFranchiseRepository extends BaseRepository<IUser> {
  private static instance: UsersByFranchiseRepository

  private constructor() {
    super(apiRoutes.realstate.usersByFranchise)
  }

  public static getInstance(): UsersByFranchiseRepository {
    if (!UsersByFranchiseRepository.instance) {
      UsersByFranchiseRepository.instance = new UsersByFranchiseRepository()
    }


return UsersByFranchiseRepository.instance
  }
}

export default UsersByFranchiseRepository.getInstance()
