import PropertyStatusRepository from '@/repositories/properties/PropertyStatusRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { SimpleItem } from '@/types/apps/PropiedadesTypes'

export default function usePropertyStatus(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<SimpleItem>(PropertyStatusRepository, defaultFilters)
}
