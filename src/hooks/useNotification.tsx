import { useContext } from 'react'

import { NotificationContext } from '@context/NotificationContext'

export const useNotification = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    // During SSR/SSG, return a default state instead of throwing
    if (typeof window === 'undefined') {
      return {
        notify: () => {} // No-op function during SSR
      }
    }

    throw new Error('useNotification must be used within a NotificationProvider')
  }

  return context
}
