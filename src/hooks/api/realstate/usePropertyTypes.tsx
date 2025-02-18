import propertyTypesRepository from '@/api/repositories/realstate/PropertyTypesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function usePropertyTypes(defaultFilters?: Record<string, any>) {
  return useBaseHookApi(propertyTypesRepository, defaultFilters)
}
