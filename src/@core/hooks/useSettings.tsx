// React Imports
import { useContext } from 'react'

// Context Imports
import { SettingsContext } from '@core/contexts/settingsContext'

// Config Imports
import themeConfig from '@configs/themeConfig'
import primaryColorConfig from '@configs/primaryColorConfig'

export const useSettings = () => {
  // Hooks
  const context = useContext(SettingsContext)

  // During build or when context is not available, return default settings
  if (!context) {
    // Check if we're in a build environment or server-side rendering
    if (typeof window === 'undefined') {
      return {
        settings: {
          mode: themeConfig.mode,
          skin: themeConfig.skin,
          semiDark: themeConfig.semiDark,
          layout: themeConfig.layout,
          navbarContentWidth: themeConfig.navbar.contentWidth,
          contentWidth: themeConfig.contentWidth,
          footerContentWidth: themeConfig.footer.contentWidth,
          primaryColor: primaryColorConfig[0].main
        },
        updateSettings: () => {},
        isSettingsChanged: false,
        resetSettings: () => {},
        updatePageSettings: () => () => {}
      }
    }

    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }

  return context
}
