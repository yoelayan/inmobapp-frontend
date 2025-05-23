import type { IStatus } from '@/types/apps/CatalogTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class ClientStatusRepository extends BaseRepository<IStatus> {
  private static instance: ClientStatusRepository

  private constructor() {
    super(apiRoutes.crm.clientStatus, false)
  }

  public static getInstance(): ClientStatusRepository {
    if (!ClientStatusRepository.instance) {
      ClientStatusRepository.instance = new ClientStatusRepository()
    }

    return ClientStatusRepository.instance
  }
}

export default ClientStatusRepository.getInstance()
