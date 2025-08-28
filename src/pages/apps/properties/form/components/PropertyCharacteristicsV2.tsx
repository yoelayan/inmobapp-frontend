import React, { useState, useEffect } from 'react'

// MUI components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid2 as Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

// API hooks
import { useNotification } from '@/hooks/useNotification'
import useProperties from '@/hooks/api/realstate/useProperties'

// Type definitions
import type { IPropertyCharacteristic, ICharacteristic } from '@/types/apps/RealtstateTypes'

interface PropertyCharacteristicsV2Props {
  propertyId?: string | number
  mode?: 'create' | 'edit'
}

const PropertyCharacteristicsV2: React.FC<PropertyCharacteristicsV2Props> = ({
  propertyId,
  mode = 'edit'
}) => {
  const { notify } = useNotification()
  const {
    getPropertyCharacteristics,
    allCharacteristics,
    deleteCharacteristic,
    addCharacteristic,
    updateCharacteristic
  } = useProperties()

  const [loading, setLoading] = useState<boolean>(false)
  const [loadingAll, setLoadingAll] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [characteristics, setCharacteristics] = useState<IPropertyCharacteristic[]>([])
  const [availableCharacteristics, setAvailableCharacteristics] = useState<ICharacteristic[]>([])
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<string | number>('')
  const [localValues, setLocalValues] = useState<Record<number, any>>({})

  // Fetch property characteristics
    const fetchPropertyCharacteristics = async (silent: boolean = false) => {
    if (!propertyId) return

    if (!silent) setLoading(true)
    try {
      const response = await getPropertyCharacteristics(propertyId)
      const newCharacteristics = response.results || []

      // Preservar valores locales existentes
      setCharacteristics((prev: IPropertyCharacteristic[]) => {
        const updatedCharacteristics = newCharacteristics.map((newChar: IPropertyCharacteristic) => {
          const existingChar = prev.find((p: IPropertyCharacteristic) => p.characteristic.code === newChar.characteristic.code)
          if (existingChar && localValues[existingChar.id] !== undefined) {
            return { ...newChar, value: localValues[existingChar.id] }
          }
          return newChar
        })
        return updatedCharacteristics
      })
    } catch (error) {
      console.error('Error fetching property characteristics:', error)
      notify('Error al cargar las características', 'error')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Fetch all available characteristics for adding optional ones
  const fetchAllCharacteristics = async () => {
    setLoadingAll(true)
    try {
      const response = await allCharacteristics()
      const availableChars = response.results || []

      // Filter out characteristics that are already added to the property
      const existingCharIds = characteristics.map((char: IPropertyCharacteristic) => char.characteristic.id)
      const filteredChars = availableChars.filter((char: ICharacteristic) => !existingCharIds.includes(char.id))

      setAvailableCharacteristics(filteredChars)
    } catch (error) {
      console.error('Error fetching all characteristics:', error)
      notify('Error al cargar las características disponibles', 'error')
    } finally {
      setLoadingAll(false)
    }
  }

    // Get default value based on characteristic type
  const getDefaultValueForType = (type: string): any => {
    switch (type) {
      case 'boolean':
        return false
      case 'integer':
        return 0
      case 'decimal':
        return 0.0
      case 'text':
      default:
        return ''
    }
  }

  // Handle value change for characteristics
  const handleValueChange = (characteristicId: number, value: any) => {
    // Guardar valor local
    setLocalValues(prev => ({ ...prev, [characteristicId]: value }))

    // Actualizar características
    setCharacteristics(prev =>
      prev.map(char =>
        char.id === characteristicId
          ? { ...char, value }
          : char
      )
    )
  }

    // Add new optional characteristic
  const handleAddCharacteristic = async () => {
    if (!selectedCharacteristic || !propertyId) return

    try {
      await addCharacteristic(propertyId, selectedCharacteristic)
      setSelectedCharacteristic('')

            // Solo actualizar la lista de características disponibles (silencioso)
      await fetchAllCharacteristics()
      notify('Característica agregada exitosamente', 'success')

      // Sincronizar con backend en segundo plano sin mostrar loader
      setTimeout(() => {
        fetchPropertyCharacteristics(true)
      }, 400)
    } catch (error) {
      console.error('Error adding characteristic:', error)
      notify('Error al agregar la característica', 'error')
    }
  }

    // Remove optional characteristic
  const handleRemoveCharacteristic = async (characteristicId: number) => {
    if (!propertyId) return

    try {
      await deleteCharacteristic(propertyId, characteristicId)

      // Remover de la lista local inmediatamente
      setCharacteristics(prev => prev.filter(char => char.id !== characteristicId))

      // Limpiar valor local
      setLocalValues(prev => {
        const newValues = { ...prev }
        delete newValues[characteristicId]
        return newValues
      })

      // Actualizar la lista de características disponibles (silencioso)
      await fetchAllCharacteristics()
      notify('Característica eliminada exitosamente', 'success')
    } catch (error) {
      console.error('Error removing characteristic:', error)
      notify('Error al eliminar la característica', 'error')
    }
  }

  // Save all characteristic values
  const handleSaveCharacteristics = async () => {
    if (!propertyId) return

    setSaving(true)
    try {
      const characteristicsToUpdate = characteristics.map((char: IPropertyCharacteristic) => ({
        id: char.id,
        value: char.value
      }))

      await updateCharacteristic(propertyId, characteristicsToUpdate)
      notify('Características actualizadas exitosamente', 'success')
    } catch (error) {
      console.error('Error updating characteristics:', error)
      notify('Error al actualizar las características', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Render input field based on characteristic type
  const renderInputField = (characteristic: IPropertyCharacteristic) => {
    const { id, value, characteristic: charDef } = characteristic
    const { type_value, name } = charDef

    switch (type_value) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(e) => handleValueChange(id, e.target.checked)}
                name={name}
              />
            }
            label={name}
          />
        )

      case 'integer':
        return (
          <TextField
            fullWidth
            type="number"
            label={name}
            value={value || ''}
            onChange={(e) => handleValueChange(id, parseInt(e.target.value) || 0)}
            inputProps={{
              step: 1,
              min: 0
            }}
          />
        )

      case 'decimal':
        return (
          <TextField
            fullWidth
            type="number"
            label={name}
            value={value || ''}
            onChange={(e) => handleValueChange(id, parseFloat(e.target.value) || 0)}
            inputProps={{
              step: 0.01,
              min: 0
            }}
          />
        )

      case 'text':
      default:
        return (
          <TextField
            fullWidth
            type="text"
            label={name}
            value={value || ''}
            onChange={(e) => handleValueChange(id, e.target.value)}
          />
        )
    }
  }

  // Initial load
  useEffect(() => {
    if (propertyId) {
      fetchPropertyCharacteristics()
    }
  }, [propertyId])

  // Fetch available characteristics when characteristics change
  useEffect(() => {
    if (propertyId && characteristics.length >= 0) {
      fetchAllCharacteristics()
    }
  }, [propertyId, characteristics.length])

  // Separate required and optional characteristics
  const requiredCharacteristics = characteristics.filter(char => char.characteristic.is_required)
  const optionalCharacteristics = characteristics.filter(char => !char.characteristic.is_required)

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando características...</Typography>
      </Box>
    )
  }

    return (
    <Box>
      {/* Required Characteristics Section */}
      <Typography variant='h6' gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
        🔧 Características Requeridas
      </Typography>

      <Grid container spacing={6} sx={{ mb: 6 }}>
        {requiredCharacteristics.length > 0 ? (
          requiredCharacteristics.map(characteristic => (
            <Grid key={characteristic.id} size={{ xs: 12, sm: 12 }}>
              {renderInputField(characteristic)}
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic' }}>
              No hay características requeridas configuradas
            </Typography>
          </Grid>
        )}
      </Grid>

            {/* Optional Characteristics Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
          ⚙️ Características Opcionales
        </Typography>

        {optionalCharacteristics.length > 0 ? (
          <Grid container spacing={6} sx={{ mb: 6 }}>
            {optionalCharacteristics.map(characteristic => (
              <Grid key={characteristic.id} size={{ xs: 12, sm: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {renderInputField(characteristic)}
                  </Box>
                  <IconButton
                    color='error'
                    onClick={() => handleRemoveCharacteristic(characteristic.id)}
                    sx={{ mt: 1 }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic', mb: 2 }}>
            No hay características opcionales agregadas
          </Typography>
        )}

        <Typography variant='subtitle1' gutterBottom>
          Agregar Campo Opcional
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id='add-characteristic-label'>
              Seleccionar Característica
            </InputLabel>
            <Select
              labelId='add-characteristic-label'
              value={selectedCharacteristic}
              onChange={e => setSelectedCharacteristic(e.target.value)}
              label='Seleccionar Característica'
              disabled={loadingAll || availableCharacteristics.length === 0}
            >
              {availableCharacteristics.map((char: ICharacteristic) => (
                <MenuItem key={char.id} value={char.id}>
                  {char.name} ({char.type_value})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={handleAddCharacteristic}
            disabled={!selectedCharacteristic || loadingAll}
            sx={{ minWidth: 'auto', px: 3 }}
          >
            Agregar
          </Button>
        </Box>

        {availableCharacteristics.length === 0 && !loadingAll && (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2, fontStyle: 'italic' }}>
            No hay características disponibles para agregar
          </Typography>
        )}
      </Box>

      {/* Save Button */}
      {characteristics.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant='contained'
            color='success'
            onClick={handleSaveCharacteristics}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <i className='tabler-check' />}
            sx={{ minWidth: '200px' }}
          >
            {saving ? 'Guardando...' : 'Guardar Características'}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default PropertyCharacteristicsV2
