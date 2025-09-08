// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import { useRouter, useSearchParams } from 'next/navigation'

import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

// API Imports
import ApiClient from '@/services/api/client'

// Hooks Imports
import { useNotification } from '@/hooks/useNotification'
import { useAuth } from '@auth/hooks/useAuth'

// Component Imports
import Link from '@components/common/Link'
import CustomTextField from '@core/components/mui/TextField'

const LoginForm = () => {
  const authContext = useAuth()
  const { notify } = useNotification()
  const apiClient = ApiClient.getInstance()

  // Move all useState hooks to the top
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const router = useRouter()

  const searchParams = useSearchParams()

  useEffect(() => {
    // Only set notification callback on client side
    if (typeof window !== 'undefined') {
      apiClient.setNotificationCallback(notify)
    }
  }, [apiClient, notify])

  const { login, loading } = authContext

  // Show loading state during SSR or initial client load
  if (loading || typeof window === 'undefined') {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    const redirectURL = searchParams?.get('redirectTo') ?? '/'

    router.push(redirectURL)
  }

  const handleClickShowPassword = () => {
    setIsPasswordShown(!isPasswordShown)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <CustomTextField
        autoFocus
        fullWidth
        label='Correo electrónico'
        placeholder='Ingresa tu correo electrónico'
        value={email}
        onChange={handleEmailChange}
        required
      />
      <CustomTextField
        fullWidth
        label='Contraseña'
        placeholder='············'
        id='outlined-adornment-password'
        type={isPasswordShown ? 'text' : 'password'}
        value={password}
        onChange={handlePasswordChange}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={handleMouseDown}>
                <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
        <FormControlLabel control={<Checkbox />} label='Remember me' />
        <Typography className='text-end' color='primary' component={Link}>
          Olvide mi contraseña
        </Typography>
      </div>
      <Button fullWidth variant='contained' type='submit'>
        Ingresar
      </Button>
    </form>
  )
}

export default LoginForm
