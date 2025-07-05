'use client'

// React Imports
import React, { useState, useEffect, useMemo, useCallback } from 'react'

// MUI Imports
import {
  Modal,
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'

// Form Imports
import { useForm } from 'react-hook-form'


import TextField from '@/components/features/form/TextField'
import NumberField from '@/components/features/form/NumberField'
import SwitchField from '@/components/features/form/SwitchField'

// Hook Imports
import useSearches from '@/hooks/api/crm/useSearches'
import { useNotification } from '@/hooks/useNotification'

// Type Imports
import type { ICharacteristic } from '@/types/apps/RealtstateTypes'

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
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<number | null>(null)
  const [value, setValue] = useState<string | number | boolean>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingCharacteristics, setLoadingCharacteristics] = useState(false)
  const [availableCharacteristics, setAvailableCharacteristics] = useState<ICharacteristic[]>([])
  const { addCharacteristic, allCharacteristics } = useSearches()
  const { notify } = useNotification()
  const { control, setValue: setFormValue, reset } = useForm()

  // Fetch all available characteristics
  const fetchAllCharacteristics = useCallback(async () => {
    setLoadingCharacteristics(true)

    try {
      const response = await allCharacteristics()

      if (response.results) {
        setAvailableCharacteristics(response.results)
      } else if (Array.isArray(response)) {
        // Backward compatibility for direct array responses
        setAvailableCharacteristics(response)
      }
    } catch (error) {
      console.error('Error fetching all characteristics:', error)
      notify('Error al cargar características disponibles', 'error')
    } finally {
      setLoadingCharacteristics(false)
    }
  }, [allCharacteristics, notify])

  // Cargar características cuando se abre el modal
  useEffect(() => {
    if (open) {
      fetchAllCharacteristics()
      reset()
      setSelectedCharacteristic(null)
      setValue('')
    }
  }, [open, reset, fetchAllCharacteristics])

  // Calcular el tipo de característica seleccionada con useMemo
  const characteristicType = useMemo(() => {
    if (!selectedCharacteristic) return 'text'

    const selected = availableCharacteristics.find(char => char.id === selectedCharacteristic)

    return selected?.type_value || 'text'
  }, [selectedCharacteristic, availableCharacteristics])

  // Reset value based on type
  const resetValue = useCallback((type: string) => {
    let initialValue

    switch (type) {
      case 'boolean':
        initialValue = false
        break
      case 'integer':
      case 'decimal':
        initialValue = 0
        break
      case 'text':
      default:
        initialValue = ''
        break
    }

    setValue(initialValue)
    setFormValue('charValue', initialValue)
  }, [setFormValue])

  // Cuando cambia la característica seleccionada, resetear el valor según el tipo
  useEffect(() => {
    if (selectedCharacteristic) {
      resetValue(characteristicType)
    }
  }, [selectedCharacteristic, characteristicType, resetValue])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchId) {
      notify('No se puede añadir una característica sin un ID de búsqueda', 'error')
      setIsSubmitting(false)

      return
    }

    if (!selectedCharacteristic) {
      notify('Debe seleccionar una característica', 'error')

      return
    }

    // Directly use the state value instead of form value since it's more reliable
    // and we're already keeping it in sync
    const submissionValue = value

    console.log('Submitting with values:', {
      searchId,
      characteristicId: selectedCharacteristic,
      value: submissionValue
    })

    if (
      (typeof submissionValue === 'string' && !submissionValue.trim()) ||
      submissionValue === undefined ||
      submissionValue === null
    ) {
      notify('El valor es requerido', 'error')

      return
    }

    setIsSubmitting(true)

    try {
      const response = await addCharacteristic(searchId, selectedCharacteristic, submissionValue)

      console.log('API response:', response)

      notify('Característica añadida correctamente', 'success')
      reset()
      setSelectedCharacteristic(null)
      resetValue('text')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error al añadir característica:', error)
      notify('Error al añadir la característica', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedCharacteristic(null)
      resetValue('text')
      reset()
      onClose()
    }
  }

  // Get characteristic name from selected ID
  const characteristicName = useMemo(() => {
    const characteristic = availableCharacteristics.find(char => char.id === selectedCharacteristic)

    return characteristic ? characteristic.name : ''
  }, [selectedCharacteristic, availableCharacteristics])

  // Render input based on characteristic type
  const renderInputField = () => {
    const label = characteristicName || 'Valor'

    switch (characteristicType) {
      case 'boolean':
        return (
          <SwitchField
            name='charValue'
            label={label}
            control={control}
            setValue={(name: string, newValue: boolean) => {
              setFormValue(name, newValue)
              setValue(newValue)
              console.log('SwitchField value changed:', newValue)
            }}
            value={value as boolean}
          />
        )
      case 'integer':
        return (
          <NumberField
            name='charValue'
            label={label}
            control={control}
            setValue={(name: string, newValue: number) => {
              setFormValue(name, newValue)
              setValue(newValue)
              console.log('NumberField (integer) value changed:', newValue)
            }}
            value={value as number}
            integer={true}
            disabled={isSubmitting}
          />
        )
      case 'decimal':
        return (
          <NumberField
            name='charValue'
            label={label}
            control={control}
            setValue={(name: string, newValue: number) => {
              setFormValue(name, newValue)
              setValue(newValue)
              console.log('NumberField (decimal) value changed:', newValue)
            }}
            value={value as number}
            disabled={isSubmitting}
          />
        )
      case 'text':
      default:
        return (
          <TextField
            name='charValue'
            label={label}
            control={control}
            setValue={(name: string, newValue: string) => {
              setFormValue(name, newValue)
              setValue(newValue)
              console.log('TextField value changed:', newValue)
            }}
            value={value as string}
            disabled={isSubmitting}
          />
        )
    }
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby='add-characteristic-modal-title'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '500px' },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1
        }}
      >
        <Card>
          <CardHeader
            title='Añadir Característica'
            action={
              <IconButton onClick={handleClose} disabled={isSubmitting}>
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id='add-characteristic-label'>Seleccionar Característica</InputLabel>
                  <Select
                    labelId='add-characteristic-label'
                    value={selectedCharacteristic}
                    onChange={e => setSelectedCharacteristic(Number(e.target.value))}
                    label='Seleccionar Característica'
                    disabled={loadingCharacteristics || isSubmitting || availableCharacteristics.length === 0}
                  >
                    {availableCharacteristics.map(char => (
                      <MenuItem key={char.id} value={char.id}>
                        {char.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ mt: 2 }}>
                  {selectedCharacteristic && renderInputField()}
                  {!selectedCharacteristic && <FormHelperText>Seleccione una característica primero</FormHelperText>}
                </Box>

                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={isSubmitting || !selectedCharacteristic}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <AddIcon />}
                  fullWidth
                >
                  {isSubmitting ? 'Añadiendo...' : 'Añadir Característica'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}

export default AddSearchCharacteristicModal
