import ParishesRepository from '@/services/repositories/locations/ParishesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useParishes(defaultFilters?: Record<string, any>) {
  return useBaseHookApi(ParishesRepository, defaultFilters)
}
