import UsersByFranchiseRepository from '@/api/repositories/realstate/UsersByFranchise'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useUsersByFranchiseRepository() {
  return useBaseHookApi(UsersByFranchiseRepository)
}
