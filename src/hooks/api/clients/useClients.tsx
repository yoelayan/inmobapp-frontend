import ClientsRepository from '@/repositories/clients/ClientsRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { Cliente } from '@/types/apps/ClientesTypes'

export default function useClients() {
  return useBaseHookApi<Cliente>(ClientsRepository)
}
