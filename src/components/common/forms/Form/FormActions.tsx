// components/forms/Form/FormActions.tsx
import React from 'react'

import { Box, Button } from '@mui/material'

import { Save as SaveIcon, Edit as EditIcon } from '@mui/icons-material'

import type { FormMode } from '@/types/common/forms.types'

interface FormActionsProps {
  loading?: boolean
  mode?: FormMode
  onReset?: () => void
  disabled?: boolean
  showReset?: boolean
}

export const FormActions = ({ loading, mode = 'create', onReset, disabled, showReset = true }: FormActionsProps) => {
  return (
    <Box display='flex' gap={2} justifyContent='flex-end' mt={3}>
      {showReset && (
        <Button type='button' variant='outlined' onClick={onReset} disabled={loading}>
          Limpiar
        </Button>
      )}

      <Button
        type='submit'
        variant='contained'
        disabled={disabled || loading}
        startIcon={loading ? undefined : mode === 'edit' ? <EditIcon /> : <SaveIcon />}
      >
        {loading ? 'Procesando...' : mode === 'edit' ? 'Actualizar' : 'Crear'}
      </Button>
    </Box>
  )
}
