import PropertyViewRepository from '@/repositories/properties/PropertyViewRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { SimpleItem } from '@/types/apps/PropiedadesTypes'

export default function usePropertyView(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<SimpleItem>(PropertyViewRepository, defaultFilters)
}
