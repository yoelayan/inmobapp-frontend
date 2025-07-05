import ClientsRepository from '@/services/repositories/crm/ClientsRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useClients() {
  return useBaseHookApi(ClientsRepository)
}
