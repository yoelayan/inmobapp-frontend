import StatesRepository from '@/repositories/StatesRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { Estado } from '@/types/apps/LocationsTypes'

export default function useStates() {
  return useBaseHookApi<Estado>(StatesRepository)
}
