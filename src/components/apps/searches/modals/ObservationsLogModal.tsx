'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import PersonIcon from '@mui/icons-material/Person'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Types Imports
import type { IClientObservation } from '@/types/apps/ClientesTypes'

// Hooks Imports
import useSearches from '@/hooks/api/crm/useSearches'
import useConfirmDialog from '@/hooks/useConfirmDialog'

interface ObservationsLogModalProps {
  open: boolean
  onClose: () => void
  searchId: number | null
  observations: IClientObservation[]
  onSuccess: () => void
}

const ObservationsLogModal: React.FC<ObservationsLogModalProps> = ({
  open,
  onClose,
  searchId,
  observations,
  onSuccess
}) => {
  const { deleteObservation } = useSearches()
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()


  const [localObservations, setLocalObservations] = useState<IClientObservation[]>(observations || [])

  // Actualizar el estado local cuando cambien las props
  useEffect(() => {
    setLocalObservations(observations || [])
  }, [observations])

  const handleDeleteObservation = async (observationId: number) => {
    if (!searchId) return
    showConfirmDialog({
      title: '¿Eliminar observación?',
      message: '¿Estás seguro que deseas eliminar esta observación? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          await deleteObservation(searchId, observationId)

          // Actualizar el estado local inmediatamente después de eliminar
          setLocalObservations(prevObservations => (prevObservations || []).filter(obs => obs.id !== observationId))

          // Notificar al componente padre para que actualice los datos
          onSuccess()
        } catch (error) {
          console.error('Error al eliminar la observación:', error)
        }
      }
    })
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es })
    } catch (error) {
      return dateString
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby='observations-log-title' fullWidth maxWidth='md'>
        <DialogTitle id='observations-log-title'>
          Bitácora de Observaciones
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
        <DialogContent dividers>
          {localObservations.length === 0 ? (
            <Typography variant='body1' align='center' sx={{ py: 4 }}>
              No hay observaciones registradas.
            </Typography>
          ) : (
            <List>
              {localObservations.map((observation, index) => (
                <React.Fragment key={observation.id}>
                  <ListItem
                    alignItems='flex-start'
                    secondaryAction={
                      <IconButton
                        edge='end'
                        aria-label='delete'
                        onClick={() => handleDeleteObservation(observation.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant='subtitle1' component='span'>
                            {observation.author.name}
                          </Typography>
                          <Typography variant='body2' color='text.secondary' component='span'>
                            {formatDate(observation.created_at)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box component='div'>
                          <Typography
                            sx={{ display: 'block', mt: 1 }}
                            component='span'
                            variant='body2'
                            color='text.primary'
                          >
                            {observation.description}
                          </Typography>
                          {observation.audio && (
                            <Box sx={{ mt: 1 }}>
                              <audio controls src={observation.audio} style={{ width: '100%' }} />
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < localObservations.length - 1 && <Divider variant='inset' component='li' />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color='primary'>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog />
    </>
  )
}

export default ObservationsLogModal


