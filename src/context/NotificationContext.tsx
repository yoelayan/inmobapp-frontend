'use client'

import React, { createContext, useCallback } from 'react'

import type { ReactNode } from 'react'

import { SnackbarProvider, useSnackbar, closeSnackbar } from 'notistack'

import Alert from '@mui/material/Alert'

// Tipos para las notificaciones
import type { AlertColor } from '@mui/material/Alert'


interface NotificationContextType {
  notify: (message: string, severity?: AlertColor) => void
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Proveedor del contexto de notificaciones
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SnackbarProvider
      maxSnack={5} // Número máximo de notificaciones visibles al mismo tiempo
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Posición de las notificaciones
      Components={
        {
          default: ({ message, closeToast, variant }) => (
            <Alert severity={variant as AlertColor} onClose={closeToast}>
              {message}
            </Alert>
          )
        }

      }
    >
      <NotificationContextWrapper>{children}</NotificationContextWrapper>
    </SnackbarProvider>
  )
}

// Wrapper para usar el contexto de Notistack
const NotificationContextWrapper = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar()

  const notify = useCallback(
    (message: string, severity: AlertColor = 'info') => {
      enqueueSnackbar(message, {
        variant: severity,
        action: key => <i className='tabler-x' onClick={() => closeSnackbar(key)} />

      }) // Mostrar la notificación
    },
    [enqueueSnackbar]
  )

  return <NotificationContext.Provider value={{ notify }}>{children}</NotificationContext.Provider>
}

export default NotificationContext
