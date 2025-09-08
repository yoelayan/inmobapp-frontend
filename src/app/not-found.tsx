'use client'

// Component Imports
import NotFound from '@/pages/NotFound'
import BlankLayout from '@layouts/BlankLayout'
import Providers from '@components/Providers'

const NotFoundPage = () => {
  // Vars
  const direction = 'ltr'
  const defaultSystemMode = 'light'

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={defaultSystemMode}>
        <NotFound />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
