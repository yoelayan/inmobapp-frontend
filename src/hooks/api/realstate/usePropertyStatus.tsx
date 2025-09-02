import PropertyStatusRepository from '@/services/repositories/realstate/PropertyStatusRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response'

export default function usePropertyStatus(defaultFilters?: FilterItem[]) {
  return useBaseHookApi(PropertyStatusRepository, defaultFilters)
}
