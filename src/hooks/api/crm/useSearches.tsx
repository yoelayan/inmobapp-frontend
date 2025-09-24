// React Imports
import { useCallback } from 'react'

// Repository Imports
import SearchesRepository from '@/services/repositories/crm/SearchesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { ICharacteristic, IRealProperty } from '@/types/apps/RealtstateTypes'
import type { ResponseAPI, FilterItem } from '@/types/api/response'
import { type ISearchCharacteristic } from '@/types/apps/SearchTypes'

export default function useSearches(defaultFilters?: FilterItem[]) {
  const baseHook = useBaseHookApi(SearchesRepository, defaultFilters)
  const repository = SearchesRepository

  const addCharacteristic = useCallback(
    async (id: number, characteristicId: number) => {
      return await repository.addCharacteristic(id, characteristicId)
    },
    [repository]
  )

  const deleteCharacteristic = useCallback(
    async (id: number, characteristicId: number) => {
      return await repository.deleteCharacteristic(id, characteristicId)
    },
    [repository]
  )

  const updateCharacteristic = useCallback(
    async (id: number, characteristics: ISearchCharacteristic[]) => {
      return await repository.updateCharacteristic(id, characteristics)
    },
    [repository]
  )

  const addObservation = useCallback(
    async (id: number, observation: string, audio?: File) => {
      return await repository.addObservation(id, observation, audio)
    },
    [repository]
  )

  const deleteObservation = useCallback(
    async (id: number, observationId: number) => {
      return await repository.deleteObservation(id, observationId)
    },
    [repository]
  )

  const allCharacteristics = useCallback(async (id: number): Promise<ResponseAPI<ICharacteristic>> => {
    return await repository.allCharacteristics(id)
  }, [repository])

  const getMatchedProperties = useCallback(
    async (searchId: number): Promise<ResponseAPI<IRealProperty>> => {
      return await repository.getMatchedProperties(searchId)
    },
    [repository]
  )

  const getCharacteristics = useCallback(
    async (searchId: number): Promise<ResponseAPI<ISearchCharacteristic>> => {
      return await repository.getCharacteristics(searchId)
    },
    [repository]
  )

  return {
    ...baseHook,
    addCharacteristic,
    deleteCharacteristic,
    updateCharacteristic,
    addObservation,
    deleteObservation,
    allCharacteristics,
    getMatchedProperties,
    getCharacteristics,
  }
}
