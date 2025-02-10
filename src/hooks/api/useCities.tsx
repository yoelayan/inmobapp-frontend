import CitiesRepository from '@/repositories/CitiesRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { Ciudad } from '@/types/apps/ubigeoTypes'

export default function useCities(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<Ciudad>(CitiesRepository, defaultFilters)
}
