'use client'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Client-side implementations - for use only in Client Components
export const getSettingsFromCookieClient = (): Settings => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return {}
    }

    const cookieName = themeConfig.settingsCookieName

    // Try to get from localStorage first
    const localStorageSettings = localStorage.getItem(cookieName)

    if (localStorageSettings) {
      return JSON.parse(localStorageSettings)
    }

    // Fallback to document.cookie
    const cookies = document.cookie.split(';')
    const targetCookie = cookies.find(cookie => cookie.trim().startsWith(`${cookieName}=`))

    if (targetCookie) {
      const cookieValue = targetCookie.split('=')[1]

      return JSON.parse(decodeURIComponent(cookieValue))
    }

    return {}
  } catch (error) {
    console.error('Error getting settings from cookie on client:', error)

    return {}
  }
}

export const getModeClient = (): string => {
  const settingsCookie = getSettingsFromCookieClient()

  // Get mode from cookie or fallback to theme config
  return settingsCookie.mode || themeConfig.mode
}

export const getSystemModeClient = (): SystemMode => {
  const mode = getModeClient()

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return 'light'
  }

  // Get color preference from localStorage or cookie
  let colorPref = localStorage.getItem('colorPref') || 'light'

  // Check media query for dark mode preference if in system mode
  if (mode === 'system') {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

    colorPref = prefersDarkMode ? 'dark' : 'light'
  }

  return ((mode === 'system' ? colorPref : mode) as SystemMode) || 'light'
}

export const getServerModeClient = (): string => {
  const mode = getModeClient()
  const systemMode = getSystemModeClient()

  return mode === 'system' ? systemMode : mode
}

export const getSkinClient = (): string => {
  const settingsCookie = getSettingsFromCookieClient()

  return settingsCookie.skin || 'default'
}
