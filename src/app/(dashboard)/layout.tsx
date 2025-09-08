

// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'

// Disable static generation for dashboard pages since they use context providers
export const dynamic = 'force-dynamic'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ScrollToTop from '@core/components/scroll-to-top'
import AuthGuard from '@auth/hocs/AuthGuard'

// Config Imports
import themeConfig from '@configs/themeConfig'


const Layout = ({ children }: ChildrenType) => {
  // Vars
  const defaultMode = themeConfig.mode
  const defaultSystemMode = 'light'

  return (
    <AuthGuard>
      <LayoutWrapper
        systemMode={defaultSystemMode}
        verticalLayout={
          <VerticalLayout
            navigation={<Navigation mode={defaultMode} systemMode={defaultSystemMode} />}
            navbar={<Navbar />}
            footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
        horizontalLayout={
          <HorizontalLayout header={<Header />} footer={<HorizontalFooter />}>
            {children}
          </HorizontalLayout>
        }
      />
      <ScrollToTop className='mui-fixed'>
        <Button
          variant='contained'
          className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
        >
          <i className='tabler-arrow-up' />
        </Button>
      </ScrollToTop>
    </AuthGuard>
  )
}

export default Layout
