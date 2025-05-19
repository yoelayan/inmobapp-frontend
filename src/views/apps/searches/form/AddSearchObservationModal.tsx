'use client'

// React Imports
import React, { useState, useRef, useEffect } from 'react'

// MUI Imports
import {
  Modal,
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  TextField,
  Typography,
  Alert,
  Stack
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddCommentIcon from '@mui/icons-material/AddComment'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import DeleteIcon from '@mui/icons-material/Delete'

// Hook Imports
import useSearches from '@/hooks/api/crm/useSearches'
import { useNotification } from '@/hooks/useNotification'

interface AddSearchObservationModalProps {
  open: boolean
  onClose: () => void
  searchId: string
  onSuccess: () => void
}

const AddSearchObservationModal: React.FC<AddSearchObservationModalProps> = ({
  open,
  onClose,
  searchId,
  onSuccess
}) => {
  // State management
  const [observation, setObservation] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Hooks
  const { addObservation } = useSearches()
  const { notify } = useNotification()

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Reset audio recording when modal is reopened
  useEffect(() => {
    if (open) {
      setAudioBlob(null)
      setAudioURL(null)
      setIsRecording(false)
      setErrorMessage(null)
    } else {
      // Clean up recorded audio when modal closes
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
    }
  }, [open])

  // Request microphone access
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      setErrorMessage(null)

      return stream
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setErrorMessage('No se pudo acceder al micrófono. Por favor, conceda permisos e intente nuevamente.')

      return null
    }
  }

  // Start audio recording
  const startRecording = async () => {
    const stream = await requestMicrophonePermission()

    if (!stream) {
      return
    }

    audioChunksRef.current = []

    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorderRef.current = mediaRecorder

    // Handle data available event
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    // Handle recording stopped
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
      const audioUrl = URL.createObjectURL(audioBlob)

      setAudioBlob(audioBlob)
      setAudioURL(audioUrl)
      setIsRecording(false)

      // Stop all tracks from the stream
      stream.getTracks().forEach(track => track.stop())
    }

    // Start recording
    mediaRecorder.start()
    setIsRecording(true)
  }

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  // Delete recorded audio
  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }

    setAudioBlob(null)
    setAudioURL(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const hasObservation = observation.trim().length > 0

    // validar observación
    if (!hasObservation) {
      notify('Debe proporcionar una observación de texto', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      let audioFile: File | null = null

      if (audioBlob) {
        audioFile = new File([audioBlob], 'audio-observation.wav', { type: 'audio/wav' })
      }

      const response = await addObservation(searchId, observation, audioFile)

      console.log('API response:', response)

      notify('Observación añadida correctamente', 'success')
      setObservation('')
      setAudioBlob(null)

      if (audioURL) {
        URL.revokeObjectURL(audioURL)
        setAudioURL(null)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error al añadir observación:', error)
      notify('Error al añadir la observación', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }

      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }

      setObservation('')
      setAudioBlob(null)
      setAudioURL(null)
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby='add-observation-modal-title'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '500px' },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1
        }}
      >
        <Card>
          <CardHeader
            title='Añadir Observación'
            action={
              <IconButton onClick={handleClose} disabled={isSubmitting}>
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label='Observación'
                  multiline
                  rows={4}
                  value={observation}
                  onChange={e => setObservation(e.target.value)}
                  disabled={isSubmitting}
                  placeholder='Escriba su observación aquí...'
                />

                {errorMessage && (
                  <Alert severity='error' sx={{ mb: 2 }}>
                    {errorMessage}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant='subtitle1'>Grabación de audio</Typography>

                  {audioURL ? (
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <audio src={audioURL} controls style={{ flexGrow: 1 }} />
                      <IconButton color='error' onClick={deleteRecording} disabled={isSubmitting}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ) : (
                    <Stack direction='row' spacing={2}>
                      <Button
                        variant='outlined'
                        color={isRecording ? 'error' : 'primary'}
                        startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isSubmitting}
                      >
                        {isRecording ? 'Detener grabación' : 'Iniciar grabación'}
                      </Button>

                      {isRecording && (
                        <Typography variant='body2' color='error' sx={{ display: 'flex', alignItems: 'center' }}>
                          Grabando...
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Box>

                <Typography variant='caption' color='text.secondary'>
                  * Debe proporcionar una observación de texto o una grabación de audio
                </Typography>

                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={isSubmitting || (!observation.trim() && !audioBlob)}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <AddCommentIcon />}
                  fullWidth
                >
                  {isSubmitting ? 'Añadiendo...' : 'Añadir Observación'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}

export default AddSearchObservationModal
