// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@pages/Login'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

// Disable static generation for this page since it uses context providers
export const dynamic = 'force-dynamic'

const LoginPage = () => {
  return <Login />
}

export default LoginPage
