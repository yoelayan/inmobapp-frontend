import propertyTypesRepository from '@/services/repositories/realstate/PropertyTypesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response'

export default function usePropertyTypes(defaultFilters?: FilterItem[]) {
  return useBaseHookApi(propertyTypesRepository, defaultFilters)
}
