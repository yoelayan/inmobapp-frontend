import React, { useState, useEffect } from 'react'

// MUI components
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

// Form components
import type { Control } from 'react-hook-form'

import TextField from '@/components/form/TextField'
import NumberField from '@/components/form/NumberField'
import SwitchField from '@/components/form/SwitchField'

// API hooks
import { useNotification } from '@/hooks/useNotification'
import useProperties from '@/hooks/api/realstate/useProperties'

// Type definitions
import type { IPropertyCharacteristic, ICharacteristic } from '@/types/apps/RealtstateTypes'

interface PropertyCharacteristicsProps {
  propertyId?: string
  control: Control<any>
  onChange?: (characteristics: IPropertyCharacteristic[]) => void
}

const PropertyCharacteristics: React.FC<PropertyCharacteristicsProps> = ({ propertyId, control, onChange }) => {
  const { notify } = useNotification()
  const { getPropertyCharacteristics, allCharacteristics, deleteCharacteristic, addCharacteristic } = useProperties()

  const [loading, setLoading] = useState<boolean>(false)
  const [loadingAll, setLoadingAll] = useState<boolean>(false)
  const [requiredCharacteristics, setRequiredCharacteristics] = useState<IPropertyCharacteristic[]>([])
  const [optionalCharacteristics, setOptionalCharacteristics] = useState<IPropertyCharacteristic[]>([])
  const [availableCharacteristics, setAvailableCharacteristics] = useState<ICharacteristic[]>([])
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<string | number>('')

  // Fetch property characteristics
  const fetchPropertyCharacteristics = async () => {
    if (!propertyId) return

    setLoading(true)

    try {
      const response = await getPropertyCharacteristics(propertyId)

      // Process response based on required vs optional
      if (response.results) {
        const required = response.results.filter(char => char.characteristic.is_required)
        const optional = response.results.filter(char => !char.characteristic.is_required)

        setRequiredCharacteristics(required)
        setOptionalCharacteristics(optional)

        // Notify parent component of all characteristics
        if (onChange) {
          onChange([...required, ...optional])
        }
      } else if (Array.isArray(response)) {
        // Backward compatibility for direct array responses
        const required = response.filter(char => char.characteristic.is_required)
        const optional = response.filter(char => !char.characteristic.is_required)

        setRequiredCharacteristics(required)
        setOptionalCharacteristics(optional)

        // Notify parent component of all characteristics
        if (onChange) {
          onChange([...required, ...optional])
        }
      }
    } catch (error) {
      console.error('Error fetching property characteristics:', error)
      notify('Error al cargar características', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all available characteristics
  const fetchAllCharacteristics = async () => {
    setLoadingAll(true)

    try {
      const response = await allCharacteristics()

      if (response.results) {
        // Filter out characteristics that are already added
        const currentIds = [...requiredCharacteristics, ...optionalCharacteristics].map(char => char.characteristic.id)

        const filtered = response.results.filter(char => !char.is_required && !currentIds.includes(char.id))

        setAvailableCharacteristics(filtered)
      } else if (Array.isArray(response)) {
        // Backward compatibility for direct array responses
        const currentIds = [...requiredCharacteristics, ...optionalCharacteristics].map(char => char.characteristic.id)

        const filtered = response.filter(char => !char.is_required && !currentIds.includes(char.id))

        setAvailableCharacteristics(filtered)
      }
    } catch (error) {
      console.error('Error fetching all characteristics:', error)
      notify('Error al cargar características disponibles', 'error')
    } finally {
      setLoadingAll(false)
    }
  }

  // Add a new characteristic
  const handleAddCharacteristic = async () => {
    if (!propertyId || !selectedCharacteristic) return

    try {
      await addCharacteristic(propertyId, selectedCharacteristic)
      notify('Característica agregada correctamente', 'success')

      // Refresh the lists
      await fetchPropertyCharacteristics()
      setSelectedCharacteristic('')
      await fetchAllCharacteristics()
    } catch (error) {
      console.error('Error adding characteristic:', error)
      notify('Error al agregar característica', 'error')
    }
  }

  // Remove a characteristic
  const handleRemoveCharacteristic = async (characteristicId: number) => {
    if (!propertyId) return

    try {
      await deleteCharacteristic(propertyId, characteristicId)

      // After deleting from server, refresh the entire property characteristics
      // instead of just updating the local state
      await fetchPropertyCharacteristics()

      // Refresh available characteristics
      await fetchAllCharacteristics()

      notify('Característica eliminada correctamente', 'success')
    } catch (error) {
      console.error('Error removing characteristic:', error)
      notify('Error al eliminar característica', 'error')
    }
  }

  // Handle value change for a characteristic
  const handleValueChange = (id: number, newValue: string | number | boolean) => {
    // Determine if it's required or optional
    let isRequired = false
    let updatedCharacteristics: IPropertyCharacteristic[] = []

    const requiredIndex = requiredCharacteristics.findIndex(char => char.id === id)

    if (requiredIndex >= 0) {
      isRequired = true
      updatedCharacteristics = [...requiredCharacteristics]
      updatedCharacteristics[requiredIndex] = {
        ...updatedCharacteristics[requiredIndex],
        value: newValue
      }
      setRequiredCharacteristics(updatedCharacteristics)
    } else {
      const optionalIndex = optionalCharacteristics.findIndex(char => char.id === id)

      if (optionalIndex >= 0) {
        updatedCharacteristics = [...optionalCharacteristics]
        updatedCharacteristics[optionalIndex] = {
          ...updatedCharacteristics[optionalIndex],
          value: newValue
        }
        setOptionalCharacteristics(updatedCharacteristics)
      }
    }

    // Notify parent component
    if (onChange) {
      onChange(
        isRequired
          ? [...updatedCharacteristics, ...optionalCharacteristics]
          : [...requiredCharacteristics, ...updatedCharacteristics]
      )
    }
  }

  // Create input field based on characteristic type
  const renderInputField = (characteristic: IPropertyCharacteristic) => {
    const {
      id,
      value,
      characteristic: { type_value, name }
    } = characteristic

    switch (type_value) {
      case 'boolean':
        return (
          <SwitchField
            key={id}
            name={`char_${id}`}
            label={name}
            control={control}
            setValue={(_, newValue) => handleValueChange(id, newValue)}
            value={value as boolean}
          />
        )
      case 'integer':
        return (
          <NumberField
            key={id}
            name={`char_${id}`}
            label={name}
            control={control}
            setValue={(_, newValue) => handleValueChange(id, newValue)}
            value={value as number}
          />
        )
      case 'decimal':
        return (
          <NumberField
            key={id}
            name={`char_${id}`}
            label={name}
            control={control}
            setValue={(_, newValue) => handleValueChange(id, newValue)}
            value={value as number}
          />
        )
      case 'text':
      default:
        return (
          <TextField
            key={id}
            name={`char_${id}`}
            label={name}
            control={control}
            setValue={(_, newValue) => handleValueChange(id, newValue)}
            value={value as string}
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

  // Fetch available characteristics when adding is possible
  useEffect(() => {
    if (propertyId) {
      fetchAllCharacteristics()
    }
  }, [propertyId, optionalCharacteristics.length, requiredCharacteristics.length])

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Required Characteristics Section */}
      <Typography variant='h6' gutterBottom>
        Características Requeridas
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {requiredCharacteristics.length > 0 ? (
        requiredCharacteristics.map(characteristic => (
          <Box key={characteristic.id} sx={{ mb: 2, width: '100%' }}>
            {renderInputField(characteristic)}
          </Box>
        ))
      ) : (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          No hay características requeridas
        </Typography>
      )}

      {/* Optional Characteristics Section */}
      <Typography variant='h6' sx={{ mt: 4 }} gutterBottom>
        Características Opcionales
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {optionalCharacteristics.length > 0 ? (
        optionalCharacteristics.map(characteristic => (
          <Box key={characteristic.id} sx={{ mb: 2, width: '100%', display: 'flex', alignItems: 'flex-start' }}>
            <Box sx={{ flexGrow: 1 }}>{renderInputField(characteristic)}</Box>
            <IconButton color='error' onClick={() => handleRemoveCharacteristic(characteristic.id)} sx={{ mt: 1 }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))
      ) : (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          No hay características opcionales
        </Typography>
      )}

      {/* Add New Characteristic Section */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant='subtitle1' gutterBottom>
          Agregar Nueva Característica
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
          <FormControl fullWidth>
            <InputLabel id='add-characteristic-label'>Seleccionar Característica</InputLabel>
            <Select
              labelId='add-characteristic-label'
              value={selectedCharacteristic}
              onChange={e => setSelectedCharacteristic(e.target.value)}
              label='Seleccionar Característica'
              disabled={loadingAll || availableCharacteristics.length === 0}
            >
              {availableCharacteristics.map(char => (
                <MenuItem key={char.id} value={char.id}>
                  {char.name}
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
          >
            Agregar
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default PropertyCharacteristics
