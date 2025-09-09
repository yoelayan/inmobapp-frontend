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
  Alert,
  Button,
  TextField as MUITextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

  // Función para eliminar una característica
  const handleDeleteCharacteristic = async (characteristicId: number) => {
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
  }

  // Función para iniciar la edición
  const handleStartEdit = (char: ISearchCharacteristic) => {
    setEditingCharacteristic({
      id: char.id,
      characteristic_name: char.characteristic_name || '',
      value: char.value,
      type_value: char.type_value || 'text'
    })
    setEditValue(char.value)
  }

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setEditingCharacteristic(null)
    setEditValue('')
  }

  // Función para guardar la edición
  const handleSaveEdit = async () => {
    if (!editingCharacteristic || !searchId) return

    setSaving(true)

    try {
      // Formatear la característica en el formato que espera el backend
      const characteristicData = [{
        id: editingCharacteristic.id,
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
  }

  // Función para manejar el cambio de valor en edición
  const handleEditValueChange = (value: any) => {
    setEditValue(value)
  }

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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {existingCharacteristics.map((char) => (
                    <Paper
                      key={char.id}
                      elevation={1}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {formatCharacteristicLabel(char)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleStartEdit(char)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              color: 'primary.dark',
                              backgroundColor: 'primary.light',
                              backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteCharacteristic(char.id)}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              color: 'error.dark',
                              backgroundColor: 'error.light',
                              backgroundColor: 'rgba(211, 47, 47, 0.04)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
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

        {/* Dialog para editar característica */}
        <Dialog
          open={!!editingCharacteristic}
          onClose={handleCancelEdit}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Editar: {editingCharacteristic?.characteristic_name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {editingCharacteristic?.type_value === 'boolean' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editValue}
                      onChange={(e) => handleEditValueChange(e.target.checked)}
                    />
                  }
                  label={editingCharacteristic.characteristic_name}
                />
              ) : (
                <MUITextField
                  label={`Valor para ${editingCharacteristic?.characteristic_name}`}
                  value={editValue}
                  onChange={(e) => handleEditValueChange(e.target.value)}
                  type={editingCharacteristic?.type_value === 'integer' || editingCharacteristic?.type_value === 'decimal' ? 'number' : 'text'}
                  fullWidth
                  variant="outlined"
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
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelEdit}
              startIcon={<CancelIcon />}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  )
}

export default AddSearchCharacteristicModal
