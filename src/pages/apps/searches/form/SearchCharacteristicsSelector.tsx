import React, { useState, useEffect } from 'react'

// MUI components
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'

// API hooks
import { useNotification } from '@/hooks/useNotification'
import useSearches from '@/hooks/api/crm/useSearches'

// Type definitions
import type { ICharacteristic } from '@/types/apps/RealtstateTypes'

interface SearchCharacteristicsSelectorProps {
  searchId?: number | null
  onCharacteristicAdded?: () => void
}

const SearchCharacteristicsSelector: React.FC<SearchCharacteristicsSelectorProps> = ({
  searchId,
  onCharacteristicAdded
}) => {
  const { notify } = useNotification()
  const { allCharacteristics, addCharacteristic } = useSearches()

  const [loadingAll, setLoadingAll] = useState<boolean>(false)
  const [availableCharacteristics, setAvailableCharacteristics] = useState<ICharacteristic[]>([])
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<string | number>('')

  // Fetch all available characteristics
  const fetchAllCharacteristics = async () => {
    setLoadingAll(true)

    try {
      const response = await allCharacteristics()
      const availableChars = response.results || []

      setAvailableCharacteristics(availableChars)
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

  // Add new characteristic
  const handleAddCharacteristic = async () => {
    if (!selectedCharacteristic || !searchId) return

    try {
      const selectedChar = availableCharacteristics.find(char => char.id === selectedCharacteristic)
      if (!selectedChar) return

      const defaultValue = getDefaultValueForType(selectedChar.type_value)

      await addCharacteristic(searchId, selectedCharacteristic, defaultValue)

      setSelectedCharacteristic('')
      notify('Característica agregada exitosamente', 'success')

      // Callback para notificar que se agregó una característica
      onCharacteristicAdded?.()
    } catch (error) {
      console.error('Error adding characteristic:', error)
      notify('Error al agregar la característica', 'error')
    }
  }

  // Initial load
  useEffect(() => {
    fetchAllCharacteristics()
  }, [])

  return (
    <Box>
      <Typography variant='subtitle1' gutterBottom>
        Agregar Característica
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl fullWidth>
          <InputLabel id='add-characteristic-label'>Seleccionar Característica</InputLabel>
          <Select
            labelId='add-characteristic-label'
            value={selectedCharacteristic}
            onChange={e => setSelectedCharacteristic(e.target.value)}
            label='Seleccionar Característica'
            disabled={loadingAll || availableCharacteristics.length === 0}
          >
            {availableCharacteristics.map((char: ICharacteristic) => (
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

      {loadingAll && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <CircularProgress size={16} />
          <Typography variant='body2' color='text.secondary'>
            Cargando características...
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default SearchCharacteristicsSelector
