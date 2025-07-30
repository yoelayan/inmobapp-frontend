// components/forms/containers/ModalContainer.tsx
import React from 'react'

import { Dialog, DialogTitle, DialogContent, IconButton, CircularProgress, Typography } from '@mui/material'

import { Close as CloseIcon } from '@mui/icons-material'

import type { FormContainerProps } from '@/types/common/forms.types'

interface ModalContainerProps extends FormContainerProps {
  open: boolean
  onClose: () => void
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const ModalContainer = ({
  title,
  subtitle,
  children,
  loading,
  open,
  onClose,
  maxWidth = 'sm'
}: ModalContainerProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      {title && (
        <DialogTitle>
          {title}
          {subtitle && <Typography variant='subtitle1'>{subtitle}</Typography>}
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent>
        {loading ? <CircularProgress /> : children}
      </DialogContent>
    </Dialog>
  )
}
