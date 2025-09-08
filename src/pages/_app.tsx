import type { AppProps } from 'next/app'

// Component Imports
import Providers from '@components/Providers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

export default function App({ Component, pageProps }: AppProps) {
  // Vars
  const direction = 'ltr'

  return (
    <Providers direction={direction}>
      <Component {...pageProps} />
    </Providers>
  )
}
