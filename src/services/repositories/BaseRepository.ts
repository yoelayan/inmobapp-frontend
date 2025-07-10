import ApiClient from '@/services/api/client'
import type { ResponseAPI } from '@/types/api/response'


export type InterfaceRepositoryAPI<T> = {
  getAll(params?: Record<string, any>): Promise<ResponseAPI<T>>
  refresh(params?: Record<string, any>): Promise<ResponseAPI<T>>
  get(id: number): Promise<T>
  create(data: Record<string, any>): Promise<T>
  update(id: number, data: Record<string, any>): Promise<T>
  delete(id: number): Promise<T>
}

export default class BaseRepository<T> implements InterfaceRepositoryAPI<T> {
  protected apiClient: ApiClient = ApiClient.getInstance()
  private cacheKey: string = ''

  constructor(
    private base_url: string,
    private useCache: boolean = false
  ) {
    this.base_url = base_url
    this.useCache = useCache

    if (useCache) {
      this.cacheKey = `cache_${base_url}`

      // const cachedData = this.getCachedData()
    }
  }
  private getCachedData(): ResponseAPI<T> | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.cacheKey)

      return data ? JSON.parse(data) : null
    }

    return null
  }

  private saveToCache(data: ResponseAPI<T>): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.cacheKey, JSON.stringify(data))
    }
  }

  public async getAll(filters?: Record<string, any>): Promise<ResponseAPI<T>> {
    if (this.useCache) {
      // const cachedData = this.getCachedData()

      const freshData = await this.apiClient.get<ResponseAPI<T>>(this.base_url, {})

      this.saveToCache(freshData)

      return freshData
    }

    return await this.apiClient.get<ResponseAPI<T>>(this.base_url, filters)
  }

  public async refresh(params?: Record<string, any>): Promise<ResponseAPI<T>> {
    const freshData = await this.apiClient.get<ResponseAPI<T>>(this.base_url, params)

    if (this.useCache) {
      this.saveToCache(freshData)
    }

    return freshData
  }
  public async get(id: number): Promise<T> {
    return await this.apiClient.get<T>(`${this.base_url}${id}`)
  }

  public async create(data: Record<string, any>): Promise<T> {
    return await this.apiClient.post<T>(this.base_url, data)
  }
  public async update(id: number, data: Record<string, any>): Promise<T> {
    return await this.apiClient.put<T>(`${this.base_url}${id}/`, data)
  }
  public async delete(id: number): Promise<T> {
    return await this.apiClient.delete<T>(`${this.base_url}${id}/`)
  }
}
