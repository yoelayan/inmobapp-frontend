import PropertiesNegotiationRepository from '@/api/repositories/realstate/PropertyNegotiationRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function usePropertiyNegotiation(defaultFilters?: Record<string, any>) {
  return useBaseHookApi(PropertiesNegotiationRepository, defaultFilters)
}
