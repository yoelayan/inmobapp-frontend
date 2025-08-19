import CitiesRepository from '@/services/repositories/locations/CitiesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response'

export default function useCities(defaultFilters?: FilterItem[]) {
  return useBaseHookApi(CitiesRepository, defaultFilters)
}
