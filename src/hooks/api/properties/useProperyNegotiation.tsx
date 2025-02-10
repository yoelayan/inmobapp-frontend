import PropertiesNegotiationRepository from '@/repositories/properties/PropertyNegotiationRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { SimpleItem } from '@/types/apps/PropiedadesTypes'

export default function usePropertiyNegotiation(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<SimpleItem>(PropertiesNegotiationRepository, defaultFilters)
}
