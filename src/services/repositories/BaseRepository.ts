import ApiClient from '@/services/api/client'
import type { ResponseAPI } from '@/types/api/response'


export type InterfaceRepositoryAPI<T> = {
  base_url: string
  getAll(params?: Record<string, any>): Promise<ResponseAPI<T>>
  refresh(params?: Record<string, any>): Promise<ResponseAPI<T>>
  get(id: number): Promise<T>
  create(data: Record<string, any>): Promise<T>
  update(id: number, data: Record<string, any>): Promise<T>
  delete(id: number): Promise<T>
}

export default class BaseRepository<T> implements InterfaceRepositoryAPI<T> {
  protected apiClient: ApiClient = ApiClient.getInstance()

  constructor(
    public base_url: string,
  ) {
    this.base_url = base_url

  }

  public async getAll(filters?: Record<string, any>): Promise<ResponseAPI<T>> {

    return await this.apiClient.get<ResponseAPI<T>>(this.base_url, filters)
  }

  public async refresh(params?: Record<string, any>): Promise<ResponseAPI<T>> {
    const freshData = await this.apiClient.get<ResponseAPI<T>>(this.base_url, params)


    return freshData
  }
  public async get(id: number): Promise<T> {
    return await this.apiClient.get<T>(`${this.base_url}${id}`)
  }

  public async create(data: Record<string, any>): Promise<T> {
    // Check if there are any File objects in the data
    const files: Record<string, File> = {}
    const nonFileData: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (value instanceof File) {
        files[key] = value
        console.log(`Found file in field '${key}':`, value.name, value.type, value.size)
      } else {
        nonFileData[key] = value
      }
    }

    console.log('BaseRepository create - Files found:', Object.keys(files))
    console.log('BaseRepository create - Non-file data:', Object.keys(nonFileData))

    // If there are files, pass them separately to the API client
    if (Object.keys(files).length > 0) {
      return await this.apiClient.post<T>(this.base_url, nonFileData, files)
    } else {
      return await this.apiClient.post<T>(this.base_url, data)
    }
  }
  public async update(id: number, data: Record<string, any>): Promise<T> {
    // Check if there are any File objects in the data
    const files: Record<string, File> = {}
    const nonFileData: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (value instanceof File) {
        files[key] = value
        console.log(`Found file in field '${key}':`, value.name, value.type, value.size)
      } else {
        nonFileData[key] = value
      }
    }

    console.log('BaseRepository update - Files found:', Object.keys(files))
    console.log('BaseRepository update - Non-file data:', Object.keys(nonFileData))

    // If there are files, pass them separately to the API client
    if (Object.keys(files).length > 0) {
      return await this.apiClient.put<T>(`${this.base_url}${id}/`, nonFileData, files)
    } else {
      return await this.apiClient.put<T>(`${this.base_url}${id}/`, data)
    }
  }
  public async delete(id: number): Promise<T> {
    return await this.apiClient.delete<T>(`${this.base_url}${id}/`)
  }
}
