import ClientStatusRepository from '@/services/repositories/crm/ClientStatusRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useClientStatus() {
  return useBaseHookApi(ClientStatusRepository)
}
