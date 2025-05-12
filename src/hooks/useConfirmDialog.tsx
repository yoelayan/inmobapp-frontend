'use client'

import React, { useState, useCallback } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

interface ConfirmDialogProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

export default function useConfirmDialog() {
  const [open, setOpen] = useState(false)

  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps>({
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  })

  const showConfirmDialog = useCallback((props: ConfirmDialogProps) => {
    setDialogProps({
      ...props,
      confirmText: props.confirmText || 'Confirmar',
      cancelText: props.cancelText || 'Cancelar'
    })
    setOpen(true)
  }, [])

  const handleConfirm = useCallback(() => {
    setOpen(false)
    dialogProps.onConfirm()
  }, [dialogProps])

  const handleCancel = useCallback(() => {
    setOpen(false)
    if (dialogProps.onCancel) dialogProps.onCancel()
  }, [dialogProps])

  const ConfirmDialog = useCallback(() => {
    return (
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogProps.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogProps.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {dialogProps.cancelText}
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            {dialogProps.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }, [open, dialogProps, handleCancel, handleConfirm])

  return { ConfirmDialog, showConfirmDialog }
}
