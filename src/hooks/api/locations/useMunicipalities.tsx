import MunicipalitiesRepository from '@/services/repositories/locations/MunicipalitiesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response'

export default function useMunicipalities(defaultFilters?: FilterItem[]) {
  return useBaseHookApi(MunicipalitiesRepository, defaultFilters)
}
