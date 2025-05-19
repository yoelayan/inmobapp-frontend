import type { ISearch } from '@/types/apps/ClientesTypes'
import { apiRoutes } from '@api/routes'
import BaseRepository from '../BaseRepository'
import type { ResponseAPI } from '../BaseRepository'

import type { ICharacteristic, IRealProperty } from '@/types/apps/RealtstateTypes'

class SearchesRepository extends BaseRepository<ISearch> {
  private static instance: SearchesRepository

  private constructor() {
    super(apiRoutes.crm.searches)
  }

  public static getInstance(): SearchesRepository {
    if (!SearchesRepository.instance) {
      SearchesRepository.instance = new SearchesRepository()
    }

    return SearchesRepository.instance
  }

  public async getMatchedProperties(searchId: string): Promise<ResponseAPI<IRealProperty>> {
    const url = apiRoutes.crm.searchesMatches.replace(':id', searchId)

    return await this.apiClient.get<ResponseAPI<IRealProperty>>(url)
  }

  public async allCharacteristics(): Promise<ResponseAPI<ICharacteristic>> {
    const url = apiRoutes.realstate.characteristics

    return await this.apiClient.get<ResponseAPI<ICharacteristic>>(url)
  }

  public async addCharacteristic(
    id: string,
    characteristicId: string | number,
    value: string | number | boolean
  ): Promise<any> {
    const url = apiRoutes.crm.searchesAddCharacteristic.replace(':id', id)

    return await this.apiClient.post(url, {
      characteristic: {
        id: characteristicId,
        value: value
      }
    })
  }

  public async deleteCharacteristic(id: string, characteristicId: string | number): Promise<any> {
    const url = apiRoutes.crm.searchesDeleteCharacteristic.replace(':id', id)

    return await this.apiClient.delete(url, {
      characteristic_id: characteristicId
    })
  }

  public async addObservation(id: string, observation: string, audio?: File): Promise<any> {
    const url = apiRoutes.crm.searchesAddObservation.replace(':id', id)

    if (audio) {
      return await this.apiClient.post(
        url,
        {
          description: observation
        },
        {
          audio: audio
        }
      )
    }

    return await this.apiClient.post(url, {
      description: observation
    })
  }

  public async deleteObservation(id: string, observationId: string | number): Promise<any> {
    const url = apiRoutes.crm.searchesDeleteObservation.replace(':id', id)

    return await this.apiClient.delete(url, {
      observation_id: observationId
    })
  }
}

export default SearchesRepository.getInstance()
