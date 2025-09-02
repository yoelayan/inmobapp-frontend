import type { IStatus } from '@/types/apps/CatalogTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class ClientStatusRepository extends BaseRepository<IStatus> {
  private static instance: ClientStatusRepository

  private constructor() {
    super(ENDPOINTS.CRM.CLIENT_STATUS.BASE)
  }

  public static getInstance(): ClientStatusRepository {
    if (!ClientStatusRepository.instance) {
      ClientStatusRepository.instance = new ClientStatusRepository()
    }

    return ClientStatusRepository.instance
  }
}

export default ClientStatusRepository.getInstance()
