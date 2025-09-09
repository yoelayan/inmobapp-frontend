'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import {
  Modal,
  Box,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  useTheme,
  Typography,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// Component Imports
import SearchCharacteristicsSelector from './SearchCharacteristicsSelector'

// Hooks Imports
import useSearches from '@/hooks/api/crm/useSearches'

// Type Imports
import type { ISearchCharacteristic } from '@/types/apps/ClientesTypes'

interface AddSearchCharacteristicModalProps {
  open: boolean
  onClose: () => void
  searchId: number | null
  onSuccess: () => void
}

const AddSearchCharacteristicModal: React.FC<AddSearchCharacteristicModalProps> = ({
  open,
  onClose,
  searchId,
  onSuccess
}) => {
  const theme = useTheme()
  const { getCharacteristics } = useSearches()

  // Estados para manejar las características existentes
  const [existingCharacteristics, setExistingCharacteristics] = useState<ISearchCharacteristic[]>([])
  const [loadingCharacteristics, setLoadingCharacteristics] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Función helper para formatear el label de la característica
  const formatCharacteristicLabel = (char: ISearchCharacteristic): string => {
    const name = char.characteristic_name || 'Sin nombre'
    const value = char.value !== null && char.value !== undefined ? String(char.value) : 'Sin valor'

    return `${name}: ${value}`
  }

  // Función para cargar las características existentes
  const loadExistingCharacteristics = async () => {
    if (!searchId) return

    setLoadingCharacteristics(true)
    setError(null)

    try {
      const response = await getCharacteristics(searchId)

      setExistingCharacteristics(response.results || [])
    } catch (err) {
      console.error('Error loading characteristics:', err)
      setError('Error al cargar las características existentes')
    } finally {
      setLoadingCharacteristics(false)
    }
  }

  // Cargar características cuando se abre el modal
  useEffect(() => {
    if (open && searchId) {
      loadExistingCharacteristics()
    } else {
      // Limpiar estado cuando se cierra el modal
      setExistingCharacteristics([])
      setError(null)
    }
  }, [open, searchId])

  const handleClose = () => {
    onClose()
  }

  const handleCharacteristicAdded = () => {
    // Recargar las características después de agregar una nueva
    loadExistingCharacteristics()
    onSuccess()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='add-characteristic-modal-title'
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
            title='Añadir Característica'
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
            {/* Mostrar error si hay alguno */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Sección de características existentes */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Características Actuales
              </Typography>

              {loadingCharacteristics ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Cargando características...
                  </Typography>
                </Box>
              ) : existingCharacteristics.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {existingCharacteristics.map((char) => (
                    <Chip
                      key={char.id}
                      label={formatCharacteristicLabel(char)}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No hay características agregadas aún
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Selector para agregar nuevas características */}
            <SearchCharacteristicsSelector
              searchId={searchId}
              onCharacteristicAdded={handleCharacteristicAdded}
            />
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}

export default AddSearchCharacteristicModal
