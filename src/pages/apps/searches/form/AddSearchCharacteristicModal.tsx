'use client'

// React Imports
import React, { useState, useEffect, useCallback, useMemo} from 'react'

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
  CircularProgress,
  Alert,
  TextField as MUITextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Button
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'

// Component Imports
import SearchCharacteristicsSelector from './SearchCharacteristicsSelector'

// Hooks Imports
import useSearches from '@/hooks/api/crm/useSearches'
import { useNotification } from '@/hooks/useNotification'

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
  const { notify } = useNotification()
  const { getCharacteristics, updateCharacteristic, deleteCharacteristic } = useSearches()

  // Estados para manejar las características existentes
  const [existingCharacteristics, setExistingCharacteristics] = useState<ISearchCharacteristic[]>([])
  const [loadingCharacteristics, setLoadingCharacteristics] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)

  // Función para cargar las características existentes
  const loadExistingCharacteristics = useCallback(async () => {
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
  }, [searchId, getCharacteristics])

  // Función para eliminar una característica
  const handleDeleteCharacteristic = useCallback(async (characteristicId: number) => {
    if (!searchId) return

    try {
      await deleteCharacteristic(searchId, characteristicId)
      notify('Característica eliminada exitosamente', 'success')
      loadExistingCharacteristics()
      onSuccess()
    } catch (err) {
      console.error('Error deleting characteristic:', err)
      notify('Error al eliminar la característica', 'error')
    }
  }, [searchId, deleteCharacteristic, notify, loadExistingCharacteristics, onSuccess])

  // Función para actualizar el valor de una característica con debounce
  const handleValueChange = useCallback((id: number, value: any) => {
    setExistingCharacteristics(prev =>
      prev.map(char =>
        char.id === id ? { ...char, value } : char
      )
    )
  }, [])

  // Función para guardar todas las características modificadas
  const handleSaveAllChanges = useCallback(async () => {
    if (!searchId) return

    setSaving(true)

    try {
      // Crear el array de características para actualizar
      const characteristicsToUpdate: ISearchCharacteristic[] = existingCharacteristics.map(char => ({
        id: char.id,
        search: {} as any, // Se completará en el backend
        characteristic: {} as any, // Se completará en el backend
        value: char.value
      }))

      await updateCharacteristic(searchId, characteristicsToUpdate)
      notify('Características actualizadas exitosamente', 'success')
      loadExistingCharacteristics()
      onSuccess()
    } catch (err) {
      console.error('Error updating characteristics:', err)
      notify('Error al actualizar las características', 'error')
    } finally {
      setSaving(false)
    }
  }, [searchId, existingCharacteristics, updateCharacteristic, notify, loadExistingCharacteristics, onSuccess])

  // Cargar características cuando se abre el modal
  useEffect(() => {
    if (open && searchId) {
      loadExistingCharacteristics()
    } else {
      // Limpiar estado cuando se cierra el modal
      setExistingCharacteristics([])
      setError(null)
    }
  }, [open, searchId, loadExistingCharacteristics])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleCharacteristicAdded = useCallback(() => {
    // Recargar las características después de agregar una nueva
    loadExistingCharacteristics()
    onSuccess()
  }, [loadExistingCharacteristics, onSuccess])

  // Memoizar la lista de características para evitar re-renderizados
  const characteristicsList = useMemo(() => {
    if (loadingCharacteristics) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Cargando características...
          </Typography>
        </Box>
      )
    }

    if (existingCharacteristics.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No hay características agregadas aún
        </Typography>
      )
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {existingCharacteristics.map((char) => (
          <CharacteristicItem
            key={char.id}
            char={char}
            onValueChange={handleValueChange}
            onDelete={handleDeleteCharacteristic}
            saving={saving}
          />
        ))}
      </Box>
    )
  }, [
    loadingCharacteristics,
    existingCharacteristics,
    handleValueChange,
    handleDeleteCharacteristic,
    saving
  ])

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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Características Actuales
                </Typography>
                {existingCharacteristics.length > 0 && (
                  <Button
                    variant='contained'
                    color='success'
                    startIcon={<SaveIcon />}
                    onClick={handleSaveAllChanges}
                    disabled={saving}
                    size="small"
                  >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                )}
              </Box>
              {characteristicsList}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Selector para agregar nuevas características */}
            <SearchCharacteristicsSelector
              searchId={searchId}
              onCharacteristicAdded={handleCharacteristicAdded}
              excludedCharacteristics={existingCharacteristics}
            />
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}

// Hook de debounce personalizado
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Componente separado para cada item de característica
interface CharacteristicItemProps {
  char: ISearchCharacteristic
  onValueChange: (id: number, value: any) => void
  onDelete: (id: number) => void
  saving: boolean
}

const CharacteristicItem: React.FC<CharacteristicItemProps> = React.memo(({
  char,
  onValueChange,
  onDelete,
  saving
}) => {
  // Determinar el tipo de valor basado en la característica
  const getTypeValue = (char: ISearchCharacteristic): string => {
    return char.characteristic_type || 'text'
  }

  const typeValue = getTypeValue(char)

  // Estado local para el valor del input
  const [localValue, setLocalValue] = useState(char.value ?? '')

  // Debounce del valor local
  const debouncedValue = useDebounce(localValue, 500) // 500ms de delay

  // Actualizar el valor local cuando cambie la característica
  useEffect(() => {
    setLocalValue(char.value ?? '')
  }, [char.value])

  // Actualizar el valor en el estado principal cuando el debounced value cambie
  useEffect(() => {
    if (debouncedValue !== char.value) {
      onValueChange(char.id, debouncedValue)
    }
  }, [debouncedValue, char.id, char.value, onValueChange])

  // Handler para cambios inmediatos en el input
  const handleInputChange = useCallback((e: any) => {
    const value = typeValue === 'boolean' ? e.target.checked : e.target.value

    setLocalValue(value)
  }, [typeValue])

  // Handler para eliminar
  const handleDelete = useCallback(() => {
    onDelete(char.id)
  }, [char.id, onDelete])

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper'
      }}
    >
      {/* Input de edición con layout vertical como las características pendientes */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ color: 'primary.main' }}
          >
            {char.characteristic_name}
          </Typography>
          <IconButton
            size="small"
            onClick={handleDelete}
            disabled={saving}
            sx={{
              color: 'error.main',
              '&:hover': {
                color: 'error.dark',
                backgroundColor: 'rgba(211, 47, 47, 0.04)'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            {typeValue === 'boolean' ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!localValue}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                }
                label={char.characteristic_name}
              />
            ) : (
              <MUITextField
                label={`Valor para ${char.characteristic_name}`}
                value={localValue}
                onChange={handleInputChange}
                type={typeValue === 'integer' || typeValue === 'decimal' ? 'number' : 'text'}
                fullWidth
                variant="outlined"
                size="small"
                disabled={saving}
                inputProps={
                  typeValue === 'integer' || typeValue === 'decimal'
                    ? {
                        min: 0,
                        step: typeValue === 'decimal' ? 0.01 : 1
                      }
                    : undefined
                }
              />
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}, (prevProps, nextProps) => {
  // Comparación personalizada para evitar re-renderizados innecesarios
  return (
    prevProps.char.id === nextProps.char.id &&
    prevProps.char.characteristic_name === nextProps.char.characteristic_name &&
    prevProps.saving === nextProps.saving
  )
})

export default AddSearchCharacteristicModal
