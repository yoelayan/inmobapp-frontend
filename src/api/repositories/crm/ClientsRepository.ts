import type { Cliente } from '@/types/apps/ClientesTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'

class ClientsRepository extends BaseRepository<Cliente> {
  private static instance: ClientsRepository

  private constructor() {
    super(apiRoutes.crm.clients)
  }

  public static getInstance(): ClientsRepository {
    if (!ClientsRepository.instance) {
      ClientsRepository.instance = new ClientsRepository()
    }


    return ClientsRepository.instance
  }
}

export default ClientsRepository.getInstance()
