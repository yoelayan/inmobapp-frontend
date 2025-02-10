// Type Imports
import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'
import { AuthProvider } from '@auth/context/AuthContext'
import { NotificationProvider } from '@context/NotificationContext'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import AppReactToastify from '@/libs/styles/AppReactToastify'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const systemMode = getSystemMode()

  return (
    <AuthProvider>
      <NotificationProvider>
        <VerticalNavProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
            <ThemeProvider direction={direction} systemMode={systemMode}>
              {children}

              <AppReactToastify direction={direction} />
            </ThemeProvider>
          </SettingsProvider>
        </VerticalNavProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default Providers
