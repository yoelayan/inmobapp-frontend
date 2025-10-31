// components/forms/Form/FormError.tsx
import React from 'react'

import { Alert } from '@mui/material'

interface FormErrorProps {
  error: any
}

export const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null

  const data = error?.response?.data
  const detail = typeof data?.detail === 'string' ? data.detail : null
  const asString = typeof data === 'string' ? data : null

  const objectSummary =
    data && typeof data === 'object' && !detail
      ? Object.entries(data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
          .join(' | ')
      : null

  const message =
    detail ||
    asString ||
    objectSummary ||
    error?.message ||
    'Ocurrió un error al procesar el formulario'

  return (
    <Alert severity='error' sx={{ mt: 2 }}>
      {message}
    </Alert>
  )
}
