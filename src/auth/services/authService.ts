'use client'

// authService.ts
import ApiClient from '@server/apiClient'
import type { User } from '@auth/types/UsuarioTypes'

class AuthService {
  private apiClient = ApiClient.getInstance()

  async login(email: string, password: string): Promise<User> {
    const data: User = await this.apiClient.post<User>('/token/', { email, password })
    return data
  }
}

export default new AuthService()
