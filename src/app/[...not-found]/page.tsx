// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@/pages/NotFound'

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
