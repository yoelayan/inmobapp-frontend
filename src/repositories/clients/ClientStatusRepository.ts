import type { Cliente } from '@/types/apps/ClientesTypes'
import { clientStatusApi } from '@/app/api/apps/clients/route'
import BaseRepository from '../BaseRepository'

class ClientStatusRepository extends BaseRepository<Cliente> {
  private static instance: ClientStatusRepository

  private constructor() {
    super(clientStatusApi, true)
  }

  public static getInstance(): ClientStatusRepository {
    if (!ClientStatusRepository.instance) {
      ClientStatusRepository.instance = new ClientStatusRepository()
    }


    return ClientStatusRepository.instance
  }
}

export default ClientStatusRepository.getInstance()
