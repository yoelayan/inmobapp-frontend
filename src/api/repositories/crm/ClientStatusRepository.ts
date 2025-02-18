import type { Cliente } from '@/types/apps/ClientesTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class ClientStatusRepository extends BaseRepository<Cliente> {
  private static instance: ClientStatusRepository

  private constructor() {
    super(apiRoutes.crm.clientStatus, true)
  }

  public static getInstance(): ClientStatusRepository {
    if (!ClientStatusRepository.instance) {
      ClientStatusRepository.instance = new ClientStatusRepository()
    }


    return ClientStatusRepository.instance
  }
}

export default ClientStatusRepository.getInstance()
