import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

import type { FilterItem, ResponseAPI } from '@/types/api/response'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'

export default function useFranchises(defaultFilters?: FilterItem[]) {
  const { ...baseHook } = useBaseHookApi(FranchisesRepository, defaultFilters)

  const fetchValidParents = async (franchiseId: number): Promise<ResponseAPI<IFranchise>> => {
    const response = await FranchisesRepository.getValidParents(franchiseId)

    return response
  }

  return { ...baseHook, fetchValidParents }
}
