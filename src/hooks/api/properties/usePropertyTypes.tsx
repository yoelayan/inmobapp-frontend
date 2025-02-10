import propertyTypesRepository from '@/repositories/properties/PropertyTypesRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { SimpleItem } from '@/types/apps/PropiedadesTypes'

export default function usePropertyTypes(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<SimpleItem>(propertyTypesRepository, defaultFilters)
}
