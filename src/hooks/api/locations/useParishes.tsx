import ParishesRepository from '@/services/repositories/locations/ParishesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response'

export default function useParishes(defaultFilters?: FilterItem[]) {
  return useBaseHookApi(ParishesRepository, defaultFilters)
}
