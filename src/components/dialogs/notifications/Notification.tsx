import React from 'react'

// MUI Imports
import Snackbar from '@mui/material/Snackbar'
import type { AlertColor } from '@mui/material/Alert'
import Alert from '@mui/material/Alert'

// Props for the Notification component
export type NotificationProps = {
  id: number // Unique ID for each notification
  severity: AlertColor
  message: string
  open: boolean
  handleClose: (id: number) => void // Function to close the notification
}

const Notification = ({ id, severity, message, open, handleClose }: NotificationProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={6000}
      onClose={() => handleClose(id)} // Close the notification by ID
    >
      <Alert severity={severity} onClose={() => handleClose(id)}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
