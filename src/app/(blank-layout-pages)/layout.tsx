// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import BlankLayout from '@layouts/BlankLayout'

// Disable static generation for blank layout pages since they use context providers
export const dynamic = 'force-dynamic'

type Props = ChildrenType

const Layout = ({ children }: Props) => {
  // Vars
  const defaultSystemMode = 'light'

  return (
    <BlankLayout systemMode={defaultSystemMode}>{children}</BlankLayout>
  )
}

export default Layout
