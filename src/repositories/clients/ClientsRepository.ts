import type { Cliente } from '@/types/apps/ClientesTypes'
import { clientsApi } from '@/app/api/apps/clients/route'
import BaseRepository from '../BaseRepository'

class ClientsRepository extends BaseRepository<Cliente> {
  private static instance: ClientsRepository

  private constructor() {
    super(clientsApi)
  }

  public static getInstance(): ClientsRepository {
    if (!ClientsRepository.instance) {
      ClientsRepository.instance = new ClientsRepository()
    }


    return ClientsRepository.instance
  }
}

export default ClientsRepository.getInstance()
