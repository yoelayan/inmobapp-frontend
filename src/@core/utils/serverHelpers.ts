// Next Imports
import { cookies } from 'next/headers'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Server-side implementations - these should only be used in Server Components
export const getSettingsFromCookie = async (): Promise<Settings> => {
  try {
    const cookieStore = await cookies()
    const cookieName = themeConfig.settingsCookieName
    const cookieValue = cookieStore.get(cookieName)?.value || '{}'

    return JSON.parse(cookieValue)
  } catch (error) {
    console.error('Error getting settings from cookie on server:', error)

    return {}
  }
}

export const getMode = async () => {
  const settingsCookie = await getSettingsFromCookie()

  // Get mode from cookie or fallback to theme config
  const _mode = settingsCookie.mode || themeConfig.mode

  return _mode
}

export const getSystemMode = async (): Promise<SystemMode> => {
  try {
    const cookieStore = await cookies()
    const mode = await getMode()
    const colorPrefCookie = (cookieStore.get('colorPref')?.value || 'light') as SystemMode

    return (mode === 'system' ? colorPrefCookie : mode) || 'light'
  } catch (error) {
    console.error('Error getting system mode on server:', error)

    return 'light'
  }
}

export const getServerMode = async () => {
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return mode === 'system' ? systemMode : mode
}

export const getSkin = async () => {
  const settingsCookie = await getSettingsFromCookie()

  return settingsCookie.skin || 'default'
}
