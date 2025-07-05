import StatesRepository from '@/services/repositories/locations/StatesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useStates() {
  return useBaseHookApi(StatesRepository)
}
