'use client'

// authService.ts
import ApiClient from '@server/apiClient'
import type { Session } from '@/auth/types/UserTypes'

class AuthService {
  private apiClient = ApiClient.getInstance()

  async login(email: string, password: string): Promise<Session> {
    const data: Session = await this.apiClient.post<Session>('/token/', { email, password })
    return data
  }
}

export default new AuthService()
