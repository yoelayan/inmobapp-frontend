import ApiClient from '@api/apiClient'

export type ResponseAPI<T> = {
  count: number
  page_number: number
  num_pages: number
  per_page: number
  next: string | null
  previous: string | null
  results: T[]
}

export type InterfaceRepositoryAPI<T> = {
  getAll(filters?: Record<string, any>): Promise<ResponseAPI<T>>
  refresh(filters?: Record<string, any>): Promise<ResponseAPI<T>>
  get(id: string): Promise<T>
  create(data: Record<string, any>): Promise<T>
  update(id: string, data: Record<string, any>): Promise<T>
  delete(id: string): Promise<T>
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
      const cachedData = this.getCachedData()

      if (cachedData) {
        console.log('Usando cache')

        return cachedData
      }

      const freshData = await this.apiClient.get<ResponseAPI<T>>(this.base_url, {})

      this.saveToCache(freshData)

      return freshData
    }

    return await this.apiClient.get<ResponseAPI<T>>(this.base_url, filters)
  }

  public async refresh(filters?: Record<string, any>): Promise<ResponseAPI<T>> {
    const freshData = await this.apiClient.get<ResponseAPI<T>>(this.base_url, filters)

    if (this.useCache) {
      this.saveToCache(freshData)
    }

    return freshData
  }
  public async get(id: string): Promise<T> {
    return await this.apiClient.get<T>(`${this.base_url}${id}`)
  }

  public async create(data: Record<string, any>): Promise<T> {
    return await this.apiClient.post<T>(this.base_url, data)
  }
  public async update(id: string, data: Record<string, any>): Promise<T> {
    return await this.apiClient.put<T>(`${this.base_url}${id}/`, data)
  }
  public async delete(id: string): Promise<T> {
    return await this.apiClient.delete<T>(`${this.base_url}${id}/`)
  }
}
