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
  Checkbox,
  Stack
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'

// Form components
import { useForm, FormProvider } from 'react-hook-form'

import { FormField } from '@/components/common/forms/Form/FormField'

// API hooks
import { useNotification } from '@/hooks/useNotification'
import useSearches from '@/hooks/api/crm/useSearches'

// Type definitions
import type { ICharacteristic } from '@/types/apps/RealtstateTypes'
import type { ISearchCharacteristic } from '@/types/apps/SearchTypes'

interface SearchCharacteristicsSelectorProps {
  searchId?: number | null
  onCharacteristicAdded?: () => void
  excludedCharacteristics?: ISearchCharacteristic[]
}

interface FormData {
  selectedCharacteristic: string | number
}

interface PendingCharacteristic {
  id: string
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
  const [pendingCharacteristics, setPendingCharacteristics] = useState<PendingCharacteristic[]>([])
  const [saving, setSaving] = useState<boolean>(false)

  // Form setup for characteristic selection
  const methods = useForm<FormData>({
    defaultValues: {
      selectedCharacteristic: ''
    }
  })

  const { handleSubmit, reset, watch } = methods
  const selectedCharacteristic = watch('selectedCharacteristic')

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

    const newPendingCharacteristic: PendingCharacteristic = {
      id: `pending_${Date.now()}_${Math.random()}`,
      characteristic: selectedChar,
      value: defaultValue
    }

    setPendingCharacteristics(prev => [...prev, newPendingCharacteristic])
    reset({ selectedCharacteristic: '' })
  }

  // Handle removing a pending characteristic
  const onRemovePendingCharacteristic = (id: string) => {
    setPendingCharacteristics(prev => prev.filter(pending => pending.id !== id))
  }

  // Handle saving all pending characteristics
  const onSaveAllPendingCharacteristics = async () => {
    if (!pendingCharacteristics.length || !searchId) return

    setSaving(true)

    try {
      // Guardar todas las características pendientes
      const savePromises = pendingCharacteristics.map(pending =>
        addCharacteristic(searchId, Number(pending.characteristic.id))
      )

      await Promise.all(savePromises)

      setPendingCharacteristics([])
      notify(`${pendingCharacteristics.length} características agregadas exitosamente`, 'success')

      // Callback para notificar que se agregaron características
      onCharacteristicAdded?.()
    } catch (error) {
      console.error('Error adding characteristics:', error)
      notify('Error al agregar las características', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Handle value change for pending characteristic
  const onPendingValueChange = (id: string, value: any) => {
    setPendingCharacteristics(prev =>
      prev.map(pending =>
        pending.id === id ? { ...pending, value } : pending
      )
    )
  }

  // Initial load and when excluded characteristics or pending characteristics change
  useEffect(() => {
    const fetchAllCharacteristics = async () => {
      setLoadingAll(true)

      try {
        if (searchId) {
          const response = await allCharacteristics(searchId)

          setAvailableCharacteristics(response.results || [])
        }
      } catch (error) {
        console.error('Error fetching all characteristics:', error)
        notify('Error al cargar las características', 'error')
      } finally {
        setLoadingAll(false)
      }
    }

    fetchAllCharacteristics()
  }, [excludedCharacteristics, pendingCharacteristics, searchId, allCharacteristics, notify])

  // Prepare options for FormField
  const characteristicOptions = availableCharacteristics.map((char: ICharacteristic) => ({
    value: char.id,
    label: char.name
  }))

  return (
    <Box>
      <Typography variant='subtitle1' gutterBottom>
        Agregar Características
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

      {/* Pending Characteristics List */}
      {pendingCharacteristics.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='subtitle2' color='primary'>
              Características Pendientes ({pendingCharacteristics.length})
            </Typography>
            <Button
              variant='contained'
              color='success'
              startIcon={<SaveIcon />}
              onClick={onSaveAllPendingCharacteristics}
              disabled={saving}
              sx={{ minWidth: 'auto', px: 3 }}
            >
              {saving ? 'Guardando...' : 'Guardar Todas'}
            </Button>
          </Box>

          <Stack spacing={1}>
            {pendingCharacteristics.map((pending) => (
              <Card key={pending.id} sx={{ border: '1px solid', borderColor: 'primary.main' }}>
                <CardContent sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant='subtitle2' color='primary'>
                      {pending.characteristic.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => onRemovePendingCharacteristic(pending.id)}
                      disabled={saving}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      {pending.characteristic.type_value === 'boolean' ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={pending.value}
                              onChange={(e) => onPendingValueChange(pending.id, e.target.checked)}
                              disabled={saving}
                            />
                          }
                          label={pending.characteristic.name}
                        />
                      ) : (
                        <MUITextField
                          label={`Valor para ${pending.characteristic.name}`}
                          value={pending.value}
                          onChange={(e) => onPendingValueChange(pending.id, e.target.value)}
                          type={pending.characteristic.type_value === 'integer' || pending.characteristic.type_value === 'decimal' ? 'number' : 'text'}
                          fullWidth
                          variant="outlined"
                          size="small"
                          disabled={saving}
                          inputProps={
                            pending.characteristic.type_value === 'integer' ||
                            pending.characteristic.type_value === 'decimal'
                              ? {
                                  min: 0,
                                  step: pending.characteristic.type_value === 'decimal' ? 0.01 : 1
                                }
                              : undefined
                          }
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {availableCharacteristics.length === 0 && !loadingAll && (
        <Typography variant='body2' color='text.secondary' sx={{ mt: 2, fontStyle: 'italic' }}>
          {excludedCharacteristics.length > 0 || pendingCharacteristics.length > 0
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
