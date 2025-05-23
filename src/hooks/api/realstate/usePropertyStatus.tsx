import PropertyStatusRepository from '@/api/repositories/realstate/PropertyStatusRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function usePropertyStatus(defaultFilters?: Record<string, any>) {
  return useBaseHookApi(PropertyStatusRepository, defaultFilters)
}
