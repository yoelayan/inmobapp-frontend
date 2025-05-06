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
import ApiClient from '@/api/apiClient'


// Hooks Imports
import { useNotification } from '@/hooks/useNotification'
import { useAuth } from '@auth/hooks/useAuth'

// Component Imports
import Link from '@components/Link'
import CustomTextField from '@core/components/mui/TextField'

const LoginForm = () => {
  const authContext = useAuth()
  const { notify } = useNotification()
  const apiClient = ApiClient.getInstance()

  useEffect(() => {
    apiClient.setNotificationCallback(notify)
  }, [apiClient, notify])

  const { login } = authContext
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    const redirectURL = searchParams.get('redirectTo') ?? '/'

    router.push(redirectURL)
  }

  const handleClickShowPassword = () => {
    setIsPasswordShown(!isPasswordShown)
  }

  return (
    <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <CustomTextField
        autoFocus
        fullWidth
        label='Correo electrónico'
        placeholder='Ingresa tu correo electrónico'
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <CustomTextField
        fullWidth
        label='Contraseña'
        placeholder='············'
        id='outlined-adornment-password'
        type={isPasswordShown ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
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
