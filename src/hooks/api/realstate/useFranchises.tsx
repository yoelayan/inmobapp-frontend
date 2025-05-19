import FranchisesRepository from '@/api/repositories/realstate/FranchisesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useFranchises(defaultFilters?: Record<string, any>) {
  return useBaseHookApi(FranchisesRepository, defaultFilters)
}
