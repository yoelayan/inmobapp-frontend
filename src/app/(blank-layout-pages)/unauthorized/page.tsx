'use client'


import { useRouter } from 'next/navigation'

import { Button, Typography, Box } from '@mui/material'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100vh' gap={3}>
      <Typography variant='h1' color='error'>
        403
      </Typography>
      <Typography variant='h4' gutterBottom>
        Acceso Denegado
      </Typography>
      <Typography variant='body1' color='text.secondary' textAlign='center'>
        No tienes los permisos necesarios para acceder a esta página.
      </Typography>
      <Button variant='contained' onClick={() => router.push('/')}>
        Volver al inicio
      </Button>
    </Box>
  )
}
