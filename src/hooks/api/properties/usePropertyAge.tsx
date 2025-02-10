import PropertyAgeRepository from '@/repositories/properties/PropertyAgeRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { SimpleItem } from '@/types/apps/PropiedadesTypes'

export default function usePropertyAge(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<SimpleItem>(PropertyAgeRepository, defaultFilters)
}
