// components/forms/Form/FormError.tsx
import React from 'react'

import { Alert } from '@mui/material'

interface FormErrorProps {
  error: any
}

export const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null

  return (
    <Alert severity='error' sx={{ mt: 2 }}>
      {error?.message || 'Ocurrió un error al procesar el formulario'}
    </Alert>
  )
}
