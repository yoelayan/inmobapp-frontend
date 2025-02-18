import CitiesRepository from '@/api/repositories/locations/CitiesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useCities(defaultFilters?: Record<string, any>) {
  return useBaseHookApi(CitiesRepository, defaultFilters)
}
