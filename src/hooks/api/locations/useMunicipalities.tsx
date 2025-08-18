import MunicipalitiesRepository from '@/services/repositories/locations/MunicipalitiesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useMunicipalities(defaultFilters?: Record<string, any>) {
  return useBaseHookApi(MunicipalitiesRepository, defaultFilters)
}
