// LogoutButton.jsx
import React from 'react'

import Button from '@mui/material/Button'

import { useAuth } from '@auth/hooks/useAuth'

const LogoutButton = () => {
  const authContext = useAuth()
  const logout = authContext?.logout || (() => {})

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Button
      fullWidth
      variant='contained'
      color='error'
      size='small'
      endIcon={<i className='tabler-logout' />}
      onClick={handleLogout}
      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
    >
      Logout
    </Button>
  )
}

export default LogoutButton
