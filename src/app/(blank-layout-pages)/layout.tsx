// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

type Props = ChildrenType

const Layout = ({ children }: Props) => {
  // Vars
  const direction = 'ltr'
  const defaultSystemMode = 'light'

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={defaultSystemMode}>{children}</BlankLayout>
    </Providers>
  )
}

export default Layout
