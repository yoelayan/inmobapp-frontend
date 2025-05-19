'use client'

// React Imports
import { useId } from 'react'

import dynamic from 'next/dynamic'

// Type Imports
import type { ChildrenType, Direction, Mode, SystemMode } from '@core/types'
import type { Settings } from '@core/contexts/settingsContext'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'
import { AuthProvider } from '@auth/context/AuthContext'
import { NotificationProvider } from '@context/NotificationContext'

// Util Imports
import { getModeClient, getSystemModeClient, getSettingsFromCookieClient } from '@core/utils/clientHelpers'

// Config Imports
import themeConfig from '@configs/themeConfig'

type Props = ChildrenType & {
  direction: Direction
  serverMode?: Mode
  serverSystemMode?: SystemMode
  serverSettings?: Settings
}

// The actual providers implementation
const ProvidersImpl = (props: Props) => {
  // Generate a unique ID for this render to avoid hydration mismatches
  const uniqueId = useId()

  // Props
  const {
    children,
    direction,
    serverMode = themeConfig.mode as Mode,
    serverSystemMode = 'light',
    serverSettings = {}
  } = props

  // Use client values directly - this component will only run on the client
  let clientSettings
  let clientMode
  let clientSystemMode

  try {
    clientMode = getModeClient() as Mode
    clientSystemMode = getSystemModeClient()
    clientSettings = getSettingsFromCookieClient()
  } catch (error) {
    // Fallback to server values if client-side functions fail
    clientSettings = serverSettings
    clientMode = serverMode
    clientSystemMode = serverSystemMode
  }

  return (
    <div key={uniqueId} suppressHydrationWarning={true}>
      <AuthProvider>
        <NotificationProvider>
          <VerticalNavProvider>
            <SettingsProvider settingsCookie={clientSettings} mode={clientMode}>
              <ThemeProvider direction={direction} systemMode={clientSystemMode}>
                {children}
              </ThemeProvider>
            </SettingsProvider>
          </VerticalNavProvider>
        </NotificationProvider>
      </AuthProvider>
    </div>
  )
}

// The main export - a dynamic component with SSR disabled
// This is the key to solving hydration issues
const Providers = dynamic(() => Promise.resolve(ProvidersImpl), {
  ssr: false
})

export default Providers as unknown as (props: Props) => JSX.Element
