'use client'

// authService.ts
import ApiClient from '@/services/api/client'
import type { Session } from '@/auth/types/UserTypes'

class AuthService {
  private apiClient = ApiClient.getInstance()

  async login(email: string, password: string): Promise<Session> {
    const data: Session = await this.apiClient.post<Session>('/token/', { email, password })

    return data
  }
}

const authService = new AuthService()

export default authService
