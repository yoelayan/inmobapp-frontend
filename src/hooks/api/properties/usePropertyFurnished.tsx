import PropertyFurnishedRepository from '@/repositories/properties/PropertyFurnishedRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { SimpleItem } from '@/types/apps/PropiedadesTypes'

export default function usePropertyFurnished(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<SimpleItem>(PropertyFurnishedRepository, defaultFilters)
}
