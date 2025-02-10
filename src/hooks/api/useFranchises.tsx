import FranchisesRepository from '@/repositories/FranchisesRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { Franquicia } from '@/types/apps/FranquiciaTypes'

export default function useFranchises(defaultFilters?: Record<string, any>) {
  return useBaseHookApi<Franquicia>(FranchisesRepository, defaultFilters)
}
