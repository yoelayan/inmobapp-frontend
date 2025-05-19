// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'CRM - Inmobapp',
  description:
    'Inmobapp es una aplicación de gestión de inmuebles que te permite gestionar tus propiedades de forma sencilla y eficaz.'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col' suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}

export default RootLayout
