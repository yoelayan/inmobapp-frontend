import React, { useState } from 'react'

// Mui Imports
import Snackbar from '@mui/material/Snackbar'
import type { AlertColor } from '@mui/material/Alert';
import Alert from '@mui/material/Alert'

export type NotificationProps = {
  severity: AlertColor
  message: string
  open: boolean
  handleClose: () => void
}

const Notification = ({ severity, message, open, handleClose }: NotificationProps) => {
  return (
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={6000}>
      <Alert severity={severity} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
