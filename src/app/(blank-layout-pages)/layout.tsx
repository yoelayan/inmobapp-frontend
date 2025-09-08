// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import BlankLayout from '@layouts/BlankLayout'

// Allow static generation for blank layout pages when possible
// export const dynamic = 'force-dynamic'

type Props = ChildrenType

const Layout = ({ children }: Props) => {
  // Vars
  const defaultSystemMode = 'light'

  return (
    <BlankLayout systemMode={defaultSystemMode}>{children}</BlankLayout>
  )
}

export default Layout
