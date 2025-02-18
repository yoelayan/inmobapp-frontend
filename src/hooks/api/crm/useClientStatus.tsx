import ClientStatusRepository from '@/api/repositories/crm/ClientStatusRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useClients() {
    return useBaseHookApi(ClientStatusRepository)
}
