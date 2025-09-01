'use client'

import React, { useState, useRef, useEffect } from 'react'

import { Box, Button, IconButton, useTheme } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormContext, Controller } from 'react-hook-form'

interface AudioFieldProps {
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
}

const AudioField: React.FC<AudioFieldProps> = ({
  name,
  label = 'Grabación de audio',
  required = false,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const theme = useTheme()
  const { control, setValue } = useFormContext()

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])


  // Cleanup audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
    }
  }, [audioURL])

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

      setAudioURL(audioUrl)
      setIsRecording(false)

      // Create a File object and set it as the field value
      const audioFile = new File([audioBlob], 'audio-recording.wav', { type: 'audio/wav' })

      setValue(name, audioFile)

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

    setAudioURL(null)
    setValue(name, null)
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? 'Este campo es requerido' : false }}
      render={({ fieldState }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {label && (
            <Box sx={{
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: '1rem'
            }}>
              {label}
              {required && <span className="text-red-500"> *</span>}
            </Box>
          )}

          {errorMessage && (
            <Box sx={{
              p: 2,
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
              borderRadius: 1,
              fontSize: '0.875rem'
            }}>
              {errorMessage}
            </Box>
          )}

          {fieldState.error && (
            <Box sx={{
              p: 1,
              color: theme.palette.error.main,
              fontSize: '0.75rem'
            }}>
              {fieldState.error.message}
            </Box>
          )}

          {audioURL ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <audio
                src={audioURL}
                controls

              />
              <IconButton
                color='error'
                onClick={deleteRecording}
                disabled={disabled}
                sx={{
                  color: theme.palette.error.main,
                  '&:hover': {
                    bgcolor: theme.palette.error.light
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant='outlined'
                color={isRecording ? 'error' : 'primary'}
                startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled}
                sx={{
                  borderColor: isRecording ? theme.palette.error.main : theme.palette.primary.main,
                  color: isRecording ? theme.palette.error.main : theme.palette.primary.main,
                  '&:hover': {
                    borderColor: isRecording ? theme.palette.error.dark : theme.palette.primary.dark,
                    bgcolor: isRecording ? theme.palette.error.light : theme.palette.primary.light
                  }
                }}
              >
                {isRecording ? 'Detener grabación' : 'Iniciar grabación'}
              </Button>

              {isRecording && (
                <Box sx={{
                  color: theme.palette.error.main,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  Grabando...
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    />
  )
}

export default AudioField
