import PropertiesNegotiationRepository from '@/services/repositories/realstate/PropertyNegotiationRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response'

export default function usePropertiyNegotiation(defaultFilters?: FilterItem[]) {
  return useBaseHookApi(PropertiesNegotiationRepository, defaultFilters)
}
