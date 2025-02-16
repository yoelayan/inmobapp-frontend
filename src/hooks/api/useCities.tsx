import CitiesRepository from '@/repositories/CitiesRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { Ciudad } from '@/types/apps/LocationsTypes'

export default function useCities(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<Ciudad>(CitiesRepository, defaultFilters)
}
