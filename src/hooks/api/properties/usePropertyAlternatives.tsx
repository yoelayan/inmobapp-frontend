import PropertyAlternativesRepository from '@/repositories/properties/PropertyAlternativesRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { SimpleItem } from '@/types/apps/PropiedadesTypes'

export default function usePropertyAlternatives(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<SimpleItem>(PropertyAlternativesRepository, defaultFilters)
}
