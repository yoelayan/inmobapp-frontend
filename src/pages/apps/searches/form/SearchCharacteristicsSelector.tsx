import React, { useState, useEffect } from 'react'

// MUI components
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField as MUITextField,
  FormControlLabel,
  Checkbox
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

// Form components
import { useForm, FormProvider } from 'react-hook-form'

import { FormField } from '@/components/common/forms/Form/FormField'

// API hooks
import { useNotification } from '@/hooks/useNotification'
import useSearches from '@/hooks/api/crm/useSearches'

// Type definitions
import type { ICharacteristic } from '@/types/apps/RealtstateTypes'
import type { ISearchCharacteristic } from '@/types/apps/ClientesTypes'

interface SearchCharacteristicsSelectorProps {
  searchId?: number | null
  onCharacteristicAdded?: () => void
  excludedCharacteristics?: ISearchCharacteristic[]
}

interface FormData {
  selectedCharacteristic: string | number
}

interface PendingCharacteristic {
  characteristic: ICharacteristic
  value: any
}

const SearchCharacteristicsSelector: React.FC<SearchCharacteristicsSelectorProps> = ({
  searchId,
  onCharacteristicAdded,
  excludedCharacteristics = []
}) => {
  const { notify } = useNotification()
  const { allCharacteristics, addCharacteristic } = useSearches()

  const [loadingAll, setLoadingAll] = useState<boolean>(false)
  const [availableCharacteristics, setAvailableCharacteristics] = useState<ICharacteristic[]>([])
  const [pendingCharacteristic, setPendingCharacteristic] = useState<PendingCharacteristic | null>(null)

  // Form setup for characteristic selection
  const methods = useForm<FormData>({
    defaultValues: {
      selectedCharacteristic: ''
    }
  })

  const { handleSubmit, reset, watch } = methods
  const selectedCharacteristic = watch('selectedCharacteristic')

  // Fetch all available characteristics
  const fetchAllCharacteristics = async () => {
    setLoadingAll(true)

    try {
      const response = await allCharacteristics()
      const availableChars = response.results || []

      // Filtrar las características excluyendo las que ya están agregadas
      // Comparar por nombre en lugar de por ID
      const filteredChars = availableChars.filter(char => {
        const isExcluded = excludedCharacteristics.some(excluded => {
          return excluded.characteristic_name === char.name
        })

        return !isExcluded
      })

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

  // Handle adding characteristic to pending list
  const onAddToPending = (data: FormData) => {
    if (!data.selectedCharacteristic) return

    const selectedChar = availableCharacteristics.find(char => char.id === data.selectedCharacteristic)

    if (!selectedChar) return

    const defaultValue = getDefaultValueForType(selectedChar.type_value)

    setPendingCharacteristic({
      characteristic: selectedChar,
      value: defaultValue
    })

    reset({ selectedCharacteristic: '' })
  }

  // Handle saving pending characteristic
  const onSavePendingCharacteristic = async () => {
    if (!pendingCharacteristic || !searchId) return

    try {
      await addCharacteristic(searchId, Number(pendingCharacteristic.characteristic.id), pendingCharacteristic.value)

      setPendingCharacteristic(null)
      notify('Característica agregada exitosamente', 'success')

      // Callback para notificar que se agregó una característica
      onCharacteristicAdded?.()
    } catch (error) {
      console.error('Error adding characteristic:', error)
      notify('Error al agregar la característica', 'error')
    }
  }

  // Handle canceling pending characteristic
  const onCancelPendingCharacteristic = () => {
    setPendingCharacteristic(null)
  }

  // Handle value change for pending characteristic
  const onPendingValueChange = (value: any) => {
    if (pendingCharacteristic) {
      setPendingCharacteristic({
        ...pendingCharacteristic,
        value
      })
    }
  }

  // Initial load and when excluded characteristics change
  useEffect(() => {
    fetchAllCharacteristics()
  }, [excludedCharacteristics])

  // Prepare options for FormField
  const characteristicOptions = availableCharacteristics.map((char: ICharacteristic) => ({
    value: char.id,
    label: char.name
  }))

  return (
    <Box>
      <Typography variant='subtitle1' gutterBottom>
        Agregar Característica
      </Typography>

      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onAddToPending)} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <FormField
              name="selectedCharacteristic"
              type="select"
              label="Seleccionar Característica"
              options={characteristicOptions}
              disabled={loadingAll || availableCharacteristics.length === 0}
              placeholder="Selecciona una característica"
              fullWidth
            />
          </Box>
          <Button
            type="submit"
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            disabled={!selectedCharacteristic || loadingAll}
            sx={{ minWidth: 'auto', px: 3 }}
          >
            Agregar
          </Button>
        </Box>
      </FormProvider>

      {/* Pending Characteristic Input - Using MUI components directly */}
      {pendingCharacteristic && (
        <Card sx={{ mt: 2, border: '1px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant='subtitle2' color='primary'>
                Configurar: {pendingCharacteristic.characteristic.name}
              </Typography>
              <IconButton size="small" onClick={onCancelPendingCharacteristic}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                {pendingCharacteristic.characteristic.type_value === 'boolean' ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={pendingCharacteristic.value}
                        onChange={(e) => onPendingValueChange(e.target.checked)}
                      />
                    }
                    label={pendingCharacteristic.characteristic.name}
                  />
                ) : (
                  <MUITextField
                    label={`Valor para ${pendingCharacteristic.characteristic.name}`}
                    value={pendingCharacteristic.value}
                    onChange={(e) => onPendingValueChange(e.target.value)}
                    type={pendingCharacteristic.characteristic.type_value === 'integer' || pendingCharacteristic.characteristic.type_value === 'decimal' ? 'number' : 'text'}
                    fullWidth
                    variant="outlined"
                    inputProps={
                      pendingCharacteristic.characteristic.type_value === 'integer' ||
                      pendingCharacteristic.characteristic.type_value === 'decimal'
                        ? {
                            min: 0,
                            step: pendingCharacteristic.characteristic.type_value === 'decimal' ? 0.01 : 1
                          }
                        : undefined
                    }
                  />
                )}
              </Box>
              <Button
                variant='contained'
                color='success'
                onClick={onSavePendingCharacteristic}
                sx={{ minWidth: 'auto', px: 3 }}
              >
                Guardar
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {availableCharacteristics.length === 0 && !loadingAll && (
        <Typography variant='body2' color='text.secondary' sx={{ mt: 2, fontStyle: 'italic' }}>
          {excludedCharacteristics.length > 0
            ? 'Todas las características disponibles ya han sido agregadas'
            : 'No hay características disponibles para agregar'
          }
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
