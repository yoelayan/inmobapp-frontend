import StatesRepository from '@/services/repositories/locations/StatesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response'

export default function useStates(defaultFilters?: FilterItem[]) {
  return useBaseHookApi(StatesRepository, defaultFilters)
}
