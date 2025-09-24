
import { ENDPOINTS } from '@/services/api/endpoints'
import BaseRepository from '../BaseRepository'
import type { ResponseAPI } from '@/types/api/response'

import type { ICharacteristic, IRealProperty } from '@/types/apps/RealtstateTypes'
import type { ISearchCharacteristic, ISearch } from '@/types/apps/SearchTypes'

class SearchesRepository extends BaseRepository<ISearch> {
  private static instance: SearchesRepository

  private constructor() {
    super(ENDPOINTS.CRM.SEARCHES.BASE)
  }

  public static getInstance(): SearchesRepository {
    if (!SearchesRepository.instance) {
      SearchesRepository.instance = new SearchesRepository()
    }

    return SearchesRepository.instance
  }

  public async getMatchedProperties(searchId: number): Promise<ResponseAPI<IRealProperty>> {
    const url = ENDPOINTS.CRM.SEARCHES.PROPERTIES_MATCHED(searchId)

    return await this.apiClient.get<ResponseAPI<IRealProperty>>(url)
  }

  public async allCharacteristics(id: number): Promise<ResponseAPI<ICharacteristic>> {
    const url = ENDPOINTS.CRM.SEARCHES.CHARACTERISTICS.ALL(id)

    return await this.apiClient.get<ResponseAPI<ICharacteristic>>(url)
  }

  public async addCharacteristic(
    id: number,
    characteristicId: string | number
  ): Promise<any> {
    const url = ENDPOINTS.CRM.SEARCHES.CHARACTERISTICS.ADD(id)

    return await this.apiClient.post(url, {
      characteristic: {
        id: characteristicId
      }
    })
  }
  public async updateCharacteristic(id: number, characteristics: ISearchCharacteristic[]): Promise<any> {
    const url = ENDPOINTS.CRM.SEARCHES.CHARACTERISTICS.UPDATE(id)

    return await this.apiClient.put(url, { characteristics: characteristics })
  }

  public async deleteCharacteristic(id: number, characteristicId: string | number): Promise<any> {
    const url = ENDPOINTS.CRM.SEARCHES.CHARACTERISTICS.DELETE(id)

    return await this.apiClient.delete(url, {
      characteristic_id: characteristicId
    })
  }

  public async addObservation(id: number, observation: string, audio?: File): Promise<any> {
    const url = ENDPOINTS.CRM.SEARCHES.OBSERVATIONS.ADD(id)

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

  public async deleteObservation(id: number, observationId: string | number): Promise<any> {
    const url = ENDPOINTS.CRM.SEARCHES.OBSERVATIONS.DELETE(id)

    return await this.apiClient.delete(url, {
      observation_id: observationId
    })
  }

  public async getCharacteristics(searchId: number): Promise<ResponseAPI<ISearchCharacteristic>> {
    const url = ENDPOINTS.CRM.SEARCHES.CHARACTERISTICS.GET(searchId)

    return await this.apiClient.get<ResponseAPI<ISearchCharacteristic>>(url)
  }
}

export default SearchesRepository.getInstance()
