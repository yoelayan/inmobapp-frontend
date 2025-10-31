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

  // Override update to use PATCH for partial updates
  public async update(id: number, data: Record<string, any>): Promise<IUser> {
    const files: Record<string, File> = {}
    const nonFileData: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (value instanceof File) {
        files[key] = value as File
      } else {
        nonFileData[key] = value
      }
    }

    if (Object.keys(files).length > 0) {
      return await this.apiClient.patch<IUser>(`${this.base_url}${id}/`, nonFileData, files)
    }

    return await this.apiClient.patch<IUser>(`${this.base_url}${id}/`, data)
  }
}

export default UsersRepository.getInstance()
