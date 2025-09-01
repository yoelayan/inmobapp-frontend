'use client'

// React Imports
import React, { useState } from 'react'

// MUI Imports
import {
  Modal,
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  IconButton,
  Divider,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddCommentIcon from '@mui/icons-material/AddComment'

// Form Imports
import { Form, FormField } from '@/components/common/forms/Form'
import { z } from 'zod'

// Hook Imports
import useSearches from '@/hooks/api/crm/useSearches'
import { useNotification } from '@/hooks/useNotification'

// Repositorio personalizado para el formulario de observaciones
const ObservationFormRepository = {
  base_url: '/searches/',
  get: async () => ({}),
  update: async () => ({}),
  create: async (data: ObservationFormData) => {
    // Esta función será reemplazada por la lógica real en formatData
    return data
  }
}

interface AddSearchObservationModalProps {
  open: boolean
  onClose: () => void
  searchId: number | null
  onSuccess: () => void
}

// Schema para el formulario de observaciones
const observationFormSchema = z.object({
  observation: z.string().min(1, { message: 'Debe proporcionar una observación de texto' }),
  audioFile: z.any().optional() // Campo opcional para el archivo de audio
})

type ObservationFormData = z.infer<typeof observationFormSchema>

const AddSearchObservationModal: React.FC<AddSearchObservationModalProps> = ({
  open,
  onClose,
  searchId,
  onSuccess
}) => {
  // Hooks
  const { addObservation } = useSearches()
  const { notify } = useNotification()
  const theme = useTheme()

  const handleSuccess = (data: ObservationFormData) => {
    console.log('Observación añadida exitosamente:', data)
    notify('Observación añadida correctamente', 'success')
    onSuccess()
    onClose()
  }

  const handleError = (error: any) => {
    console.error('Error al añadir observación:', error)
    notify('Error al añadir la observación', 'error')
  }

  // Función para formatear los datos antes de enviarlos
  const formatData = async (data: ObservationFormData) => {
    if (!searchId) {
      throw new Error('No se puede añadir una observación sin un ID de búsqueda')
    }

    console.log('Submitting with values:', {
      searchId,
      observation: data.observation,
      hasAudio: !!data.audioFile
    })

    // Llamar directamente a la función addObservation
    const response = await addObservation(searchId, data.observation, data.audioFile)
    console.log('API response:', response)
    return response
  }

  // Handle modal close
  const handleClose = () => {
    onClose()
  }

  const defaultValues: Partial<ObservationFormData> = {
    observation: '',
    audioFile: null
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='add-observation-modal-title'
      className="flex items-center justify-center p-4"
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 'md',
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.shadows[24],
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
          overflow: 'hidden'
        }}
      >
        <Card sx={{ boxShadow: 'none', border: 0 }}>
          <CardHeader
            title='Añadir Observación'
            sx={{
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(25, 118, 210, 0.04)',
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiTypography-root': {
                color: theme.palette.text.primary,
                fontWeight: 600
              }
            }}
            action={
              <IconButton
                onClick={handleClose}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.text.primary
                  },
                  transition: 'color 0.2s ease-in-out'
                }}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider sx={{ borderColor: theme.palette.divider }} />
          <CardContent sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
            <Form
              schema={() => observationFormSchema}
              defaultValues={defaultValues}
              repository={ObservationFormRepository}
              onSuccess={handleSuccess}
              onError={handleError}
              formatData={formatData}
              actionsComponent={
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  startIcon={<AddCommentIcon />}
                  sx={{
                    width: '100%',
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                    },
                    fontWeight: 600,
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    transform: 'scale(1)',
                    '&:hover:not(:disabled)': {
                      transform: 'scale(1.02)',
                      boxShadow: theme.shadows[8]
                    },
                    boxShadow: theme.shadows[4]
                  }}
                >
                  Añadir Observación
                </Button>
              }
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormField
                  name='observation'
                  label='Observación'
                  type='text'
                  required
                  multiline
                  rows={4}
                  placeholder='Escriba su observación aquí...'
                />

                <FormField
                  name='audioFile'
                  label='Grabación de audio (opcional)'
                  type='audio'
                />

                <Box sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                  fontStyle: 'italic'
                }}>
                  * Debe proporcionar una observación de texto o una grabación de audio
                </Box>
              </Box>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}

export default AddSearchObservationModal
