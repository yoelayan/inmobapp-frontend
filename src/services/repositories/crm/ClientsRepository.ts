import type { IClient } from '@/types/apps/ClientesTypes'
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'

class ClientsRepository extends BaseRepository<IClient> {
  private static instance: ClientsRepository

  private constructor() {
    super(ENDPOINTS.CRM.CLIENTS.BASE)
  }

  public static getInstance(): ClientsRepository {
    if (!ClientsRepository.instance) {
      ClientsRepository.instance = new ClientsRepository()
    }

    return ClientsRepository.instance
  }
}

export default ClientsRepository.getInstance()
