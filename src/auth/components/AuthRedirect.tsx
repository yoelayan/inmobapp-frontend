'use client'

// Next Imports
import { useEffect } from 'react'

import { useRouter, usePathname } from 'next/navigation'

// Config Imports
import themeConfig from '@configs/themeConfig'

const AuthRedirect = () => {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const redirectUrl = `/login?redirectTo=${pathname}`
    const login = `/login`
    const homePage = themeConfig.homePageUrl

    if (pathname !== login && pathname !== homePage) {
      router.push(redirectUrl)
    } else {
      router.push(login)
    }
  }, [pathname, router])

  return <></>
}

export default AuthRedirect
