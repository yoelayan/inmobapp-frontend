import ClientStatusRepository from '@/repositories/clients/ClientStatusRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { Cliente } from '@/types/apps/ClientesTypes'

export default function useClients() {
    return useBaseHookApi<Cliente>(ClientStatusRepository)
}
