'use client'
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react'

// Component Imports
import type { AlertColor } from '@mui/material/Alert'

import Notification from '@components/dialogs/notifications/Notification'

// Mui Imports

interface NotificationContextType {
  notify: (
    message: string,
    severity?: AlertColor
  ) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null)
  const [severity, setSeverity] = useState<AlertColor>('error')
  const [open, setOpen] = useState<boolean>(false)

  const notify = (msg: string, severity: AlertColor = 'error') => {
    
    setSeverity(severity)
    setMessage(msg)
    setOpen(true)
  }

  const clearMessage = () => {
    setMessage(null)
    setOpen(false)
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {message && <Notification severity={severity} message={message} open={open} handleClose={clearMessage} />}
    </NotificationContext.Provider>
  )
}

export { NotificationContext }
