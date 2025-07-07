import { useState, useCallback } from 'react'

import UsersRepository from '@/services/repositories/users/UsersRepository'
import type { ResponseAPI } from '@/services/repositories/BaseRepository'
import type { IUser } from '@/types/apps/UserTypes'

export default function useUsersByFranchise() {
  const [data, setData] = useState<ResponseAPI<IUser> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsersByFranchise = useCallback(async (franchiseId: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await UsersRepository.getUsersByFranchise(franchiseId)

      setData(response)
    } catch (err) {
      setError('Error fetching users by franchise')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    loading,
    error,
    fetchUsersByFranchise
  }
}
