'use client'

// authService.ts
import ApiClient from '@/services/api/client'
import type { Session, IProfile } from '@/auth/types/UserTypes'

class AuthService {
  private apiClient = ApiClient.getInstance()

  async login(email: string, password: string): Promise<Session> {
    const data: Session = await this.apiClient.post<Session>('/token/', { email, password })

    return data
  }
  async me(): Promise<IProfile> {
    const data: IProfile = await this.apiClient.get<IProfile>('/users/me/')

    return data
  }
}

const authService = new AuthService()

export default authService
