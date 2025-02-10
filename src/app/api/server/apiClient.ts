'use client'
import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios'

class ApiClient {
  private static instance: ApiClient
  private axiosInstance: AxiosInstance
  private notificationCallback?: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        this.handlerError(error)

        return Promise.reject(error)
      }
    )
  }
  private buildGetParams(params: Record<string, any>): string {
    const queryString = new URLSearchParams(params).toString()


    return queryString ? `?${queryString}` : ''
  }

  private buildPostParams(params: Record<string, any>): string {
    return JSON.stringify(params)
  }

  public setNotificationCallback(callback: (message: string) => void): void {
    this.notificationCallback = callback
  }

  public setToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  public removeToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization']
  }

  public isTokenSet(): boolean {
    return !!this.axiosInstance.defaults.headers.common['Authorization']
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }

    if (!ApiClient.instance.isTokenSet()) {
      try {
        const session = JSON.parse(localStorage.getItem('session') || '')

        if (!session) {
          return ApiClient.instance
        }

        const token = session.access_token

        if (token) {
          ApiClient.instance.setToken(token)
        }
      } catch (error) {
        ApiClient.instance.removeToken()
      }
    }


    return ApiClient.instance
  }

  private handlerError(error: any): void {
    switch (error.response?.status) {
      case 401:
        this.removeToken()
        break
      default:
        break
    }

    if (this.notificationCallback) {
      switch (error.response?.status) {
        case 401:
          this.notificationCallback('No autorizado: Por favor inicie sesión', 'error')

          return
        case 403:
          this.notificationCallback('No autorizado: No tiene permiso para realizar esta acción', 'error')

          return
        case 404:
          this.notificationCallback('No encontrado: La entidad solicitada no existe', 'error')

          return
        case 500:
          this.notificationCallback('Error del servidor: Por favor inténtelo de nuevo más tarde', 'error')

          return
      }

      if (error.message === 'Network Error') {
        this.notificationCallback('Network Error: Please check your internet connection or Server is down')

        return
      }

      const errorMessage = error.response?.data?.detail || error.message || 'An error occurred'

      this.notificationCallback(errorMessage)
    }
  }

  public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const queryString = this.buildGetParams(params || {})
    const response: AxiosResponse<T> = await this.axiosInstance.get(`${url}${queryString}`)


    return response.data
  }

  public async post<T>(url: string, data: Record<string, any>): Promise<T> {
    const postData = this.buildPostParams(data)
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, postData)


    return response.data
  }

  public async put<T>(url: string, data: Record<string, any>): Promise<T> {
    const putData = this.buildPostParams(data)
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, putData)


    return response.data
  }

  public async delete<T>(url: string, params?: Record<string, any>): Promise<T> {
    const queryString = this.buildGetParams(params || {})
    const response: AxiosResponse<T> = await this.axiosInstance.delete(`${url}${queryString}`)


    return response.data
  }

  public async uploadFile<T>(url: string, file: File): Promise<T> {
    const formData = new FormData()

    formData.append('file', file)

    const response: AxiosResponse<T> = await this.axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })


    return response.data
  }

  public async downloadFile(url: string, params?: Record<string, any>): Promise<Blob> {
    const queryString = this.buildGetParams(params || {})

    const response: AxiosResponse<Blob> = await this.axiosInstance.get(`${url}${queryString}`, {
      responseType: 'blob'
    })


    return response.data
  }

  public async customRequest<T>(config: any): Promise<T> {
    if (config.method === 'get' && config.params) {
      config.url += this.buildGetParams(config.params)
    } else if (config.data) {
      config.data = this.buildPostParams(config.data)
    }

    const response: AxiosResponse<T> = await this.axiosInstance.request(config)


    return response.data
  }
}

export default ApiClient
