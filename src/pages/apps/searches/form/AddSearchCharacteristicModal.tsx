'use client'

// React Imports
import React, { useState, useEffect, useCallback, useMemo } from 'react'

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
  Paper
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

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

interface EditingCharacteristic {
  id: number
  characteristic_name: string
  value: any
  type_value: string
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

  // Estados para edición
  const [editingCharacteristic, setEditingCharacteristic] = useState<EditingCharacteristic | null>(null)
  const [editValue, setEditValue] = useState<any>('')
  const [saving, setSaving] = useState<boolean>(false)

  // Función helper para formatear el label de la característica
  const formatCharacteristicLabel = useCallback((char: ISearchCharacteristic): string => {
    const name = char.characteristic_name || 'Sin nombre'
    const value = char.value !== null && char.value !== undefined ? String(char.value) : 'Sin valor'

    return `${name}: ${value}`
  }, [])

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

  // Función para iniciar la edición
  const handleStartEdit = useCallback((char: ISearchCharacteristic) => {
    setEditingCharacteristic({
      id: char.id,
      characteristic_name: char.characteristic_name || '',
      value: char.value,
      type_value: char.characteristic_type || 'text'
    })
    setEditValue(char.value)
  }, [])

  // Función para cancelar la edición
  const handleCancelEdit = useCallback(() => {
    setEditingCharacteristic(null)
    setEditValue('')
  }, [])

  // Función para guardar la edición
  const handleSaveEdit = useCallback(async () => {
    if (!editingCharacteristic || !searchId) return

    setSaving(true)

    try {
      // Crear el objeto con la estructura correcta para el backend
      const characteristicData: ISearchCharacteristic[] = [{
        id: editingCharacteristic.id,
        search: {} as any, // Se completará en el backend
        characteristic: {} as any, // Se completará en el backend
        value: editValue
      }]

      await updateCharacteristic(searchId, characteristicData)
      notify('Característica actualizada exitosamente', 'success')
      setEditingCharacteristic(null)
      setEditValue('')
      loadExistingCharacteristics()
      onSuccess()
    } catch (err) {
      console.error('Error updating characteristic:', err)
      notify('Error al actualizar la característica', 'error')
    } finally {
      setSaving(false)
    }
  }, [editingCharacteristic, searchId, editValue, updateCharacteristic, notify, loadExistingCharacteristics, onSuccess])

  // Función para manejar el cambio de valor en edición
  const handleEditValueChange = useCallback((value: any) => {
    setEditValue(value)
  }, [])

  // Cargar características cuando se abre el modal
  useEffect(() => {
    if (open && searchId) {
      loadExistingCharacteristics()
    } else {
      // Limpiar estado cuando se cierra el modal
      setExistingCharacteristics([])
      setError(null)
      setEditingCharacteristic(null)
      setEditValue('')
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
            editingCharacteristic={editingCharacteristic}
            editValue={editValue}
            saving={saving}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onDeleteCharacteristic={handleDeleteCharacteristic}
            onEditValueChange={handleEditValueChange}
            formatCharacteristicLabel={formatCharacteristicLabel}
          />
        ))}
      </Box>
    )
  }, [
    loadingCharacteristics,
    existingCharacteristics,
    editingCharacteristic,
    editValue,
    saving,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDeleteCharacteristic,
    handleEditValueChange,
    formatCharacteristicLabel
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
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Características Actuales
              </Typography>
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

// Componente separado para cada item de característica
interface CharacteristicItemProps {
  char: ISearchCharacteristic
  editingCharacteristic: EditingCharacteristic | null
  editValue: any
  saving: boolean
  onStartEdit: (char: ISearchCharacteristic) => void
  onCancelEdit: () => void
  onSaveEdit: () => void
  onDeleteCharacteristic: (id: number) => void
  onEditValueChange: (value: any) => void
  formatCharacteristicLabel: (char: ISearchCharacteristic) => string
}

const CharacteristicItem: React.FC<CharacteristicItemProps> = React.memo(({
  char,
  editingCharacteristic,
  editValue,
  saving,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteCharacteristic,
  onEditValueChange,
  formatCharacteristicLabel
}) => {
  const isEditing = editingCharacteristic?.id === char.id

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: isEditing ? 'primary.main' : 'divider',
        borderRadius: 1,
        bgcolor: isEditing ? 'rgba(25, 118, 210, 0.02)' : 'background.paper'
      }}
    >
      {/* Contenido normal o modo edición */}
      {isEditing ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ minWidth: 'fit-content' }}>
            {char.characteristic_name}:
          </Typography>
          <Box sx={{ flex: 1, maxWidth: 300 }}>
            {editingCharacteristic?.type_value === 'boolean' ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!editValue}
                    onChange={(e) => onEditValueChange(e.target.checked)}
                    disabled={saving}
                  />
                }
                label=""
              />
            ) : (
              <MUITextField
                value={editValue ?? ''}
                onChange={(e) => onEditValueChange(e.target.value)}
                type={editingCharacteristic?.type_value === 'integer' || editingCharacteristic?.type_value === 'decimal' ? 'number' : 'text'}
                size="small"
                fullWidth
                variant="outlined"
                disabled={saving}
                inputProps={
                  editingCharacteristic?.type_value === 'integer' ||
                  editingCharacteristic?.type_value === 'decimal'
                    ? {
                        min: 0,
                        step: editingCharacteristic?.type_value === 'decimal' ? 0.01 : 1
                      }
                    : undefined
                }
              />
            )}
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" sx={{ flex: 1 }}>
          {formatCharacteristicLabel(char)}
        </Typography>
      )}

      {/* Botones de acción */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {isEditing ? (
          <>
            <IconButton
              size="small"
              onClick={onSaveEdit}
              disabled={saving}
              sx={{
                color: 'success.main',
                '&:hover': {
                  color: 'success.dark',
                  backgroundColor: 'rgba(76, 175, 80, 0.04)'
                }
              }}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onCancelEdit}
              disabled={saving}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              size="small"
              onClick={() => onStartEdit(char)}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  color: 'primary.dark',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDeleteCharacteristic(char.id)}
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
          </>
        )}
      </Box>
    </Paper>
  )
})

export default AddSearchCharacteristicModal
