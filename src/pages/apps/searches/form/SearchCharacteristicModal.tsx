import { useState, useEffect, useRef } from 'react'

import {
  Modal,
  Box,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  useTheme,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  CardActions
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

import { type ICharacteristic } from '@/types/apps/RealtstateTypes'
import { type ISearchCharacteristic } from '@/types/apps/SearchTypes'
import useSearches from '@/hooks/api/crm/useSearches'
import { useNotification } from '@/hooks/useNotification'

interface SearchCharacteristicModalV2Props {
  open: boolean
  onClose: () => void
  searchId: number | null
  onSuccess: () => void
}

interface ComponentState {
  characteristics: ISearchCharacteristic[]
  selectedCharacteristic: string | number
  availableCharacteristics: ICharacteristic[]
  loadingAll: boolean
}

const SearchCharacteristicModalV2 = ({ open, onClose, searchId, onSuccess }: SearchCharacteristicModalV2Props) => {
  const theme = useTheme()
  const isMounted = useRef<boolean>(true)

  const { deleteCharacteristic, addCharacteristic, allCharacteristics, getCharacteristics, updateCharacteristic } = useSearches()

  const [state, setState] = useState<ComponentState>({
    characteristics: [],
    selectedCharacteristic: '',
    availableCharacteristics: [],
    loadingAll: false
  })

  const { notify } = useNotification()

  const handleClose = () => {
    onClose()
  }

  const handleSuccess = () => {
    onSuccess()
  }

  const fetchSearchCharacteristics = async () => {
    if (!searchId) return
    setState(prev => ({ ...prev, loadingAll: true }))

    try {
      const response = await getCharacteristics(searchId)

      setState(prev => ({ ...prev, characteristics: response.results || [] }))
    } catch (error) {
      console.error('Error fetching search characteristics:', error)
      notify('Error al cargar las características', 'error')
    } finally {
      setState(prev => ({ ...prev, loadingAll: false }))
    }
  }

  const fetchAllCharacteristics = async () => {
    if (!searchId) return

    console.log('fetchAllCharacteristics')
    setState(prev => ({ ...prev, loadingAll: true }))

    try {
      const response = await allCharacteristics(searchId)
      const availableChars = response.results || []

      setState(prev => ({ ...prev, availableCharacteristics: availableChars }))
    } catch (error) {
      console.error('Error fetching all characteristics:', error)
      notify('Error al cargar las características disponibles', 'error')
    } finally {
      setState(prev => ({ ...prev, loadingAll: false }))
    }
  }

  const handleValueChange = (characteristicId: number, value: any) => {
    // Actualizar características
    setState(prev => ({
      ...prev,
      characteristics: prev.characteristics.map(char =>
        char.id === characteristicId ? { ...char, value } : char
      )
    }))
  }

  const handleRemoveCharacteristic = async (characteristicId: number) => {
    if (!searchId) return

    try {
      await deleteCharacteristic(searchId, characteristicId)

      // Remover de la lista local inmediatamente
      setState(prev => ({
        ...prev,
        characteristics: prev.characteristics.filter(char => char.id !== characteristicId)
      }))

      // Actualizar la lista de características disponibles (silencioso)
      await fetchAllCharacteristics()
      notify('Característica eliminada exitosamente', 'success')
    } catch (error) {
      console.error('Error removing characteristic:', error)
      notify('Error al eliminar la característica', 'error')
    }
  }

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

  const handleAddCharacteristic = async () => {
    if (!state.selectedCharacteristic || !searchId) return

    try {
      const response = await addCharacteristic(searchId, Number(state.selectedCharacteristic))

      // Si la respuesta incluye la nueva característica, aplicar valor por defecto inmediatamente
      if (response && response.characteristic) {
        const defaultValue = getDefaultValueForType(response.characteristic.type_value)

        // Agregar la nueva característica con valor por defecto al estado local
        setState(prev => ({
          ...prev,
          characteristics: [
            ...prev.characteristics,
            {
              ...response,
              value:
                response.value !== null && response.value !== undefined && response.value !== ''
                  ? response.value
                  : defaultValue
            }
          ],
          selectedCharacteristic: ''
        }))
      }

      // Solo actualizar la lista de características disponibles (silencioso)
      await fetchAllCharacteristics()
      notify('Característica agregada exitosamente', 'success')

      // Sincronizar con backend en segundo plano sin mostrar loader
      setTimeout(() => {
        fetchSearchCharacteristics()
      }, 400)

    } catch (error) {
      console.error('Error adding characteristic:', error)
      notify('Error al agregar la característica', 'error')
    }
  }



  const renderInputField = (characteristic: ISearchCharacteristic) => {
    const { id, value, characteristic: charDef } = characteristic

    if (!charDef) return null

    const { type_value, name } = charDef

    switch (type_value) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value !== undefined && value !== null ? value : false)}
                onChange={e => handleValueChange(id, e.target.checked)}
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
            type='number'
            label={name}
            value={value !== undefined && value !== null ? value : 0}
            onChange={e => handleValueChange(id, parseInt(e.target.value) || 0)}
            slotProps={{
              input: {
                inputProps: {
                  step: 1,
                  min: 0
                }
              }
            }}
          />
        )

      case 'decimal':
        return (
          <TextField
            fullWidth
            type='number'
            label={name}
            value={value !== undefined && value !== null ? value : 0.0}
            onChange={e => handleValueChange(id, parseFloat(e.target.value) || 0)}
            slotProps={{
              input: {
                inputProps: {
                  step: 0.01,
                  min: 0
                }
              }
            }}
          />
        )

      case 'text':
      default:
        return (
          <TextField
            fullWidth
            type='text'
            label={name}
            value={value !== undefined && value !== null ? value : ''}
            onChange={e => handleValueChange(id, e.target.value)}
          />
        )
    }
  }

  const onSubmit = async () => {
    if (!searchId) return

    try {
      await updateCharacteristic(searchId, state.characteristics)
      notify('Características actualizadas exitosamente', 'success')
      handleSuccess()
      handleClose()
    } catch (error) {
      console.error('Error updating characteristics:', error)
      notify('Error al actualizar las características', 'error')
    }
  }

  // Se cuando se RENDERIZA el componente
  useEffect(() => {
    if (!isMounted.current) return

    if (searchId) {
      fetchSearchCharacteristics()
    }

    if (state.characteristics.length >= 0) {
      fetchAllCharacteristics()
    }

    isMounted.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchId])


  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='add-observation-modal-title'
      className='flex items-center justify-center p-4'
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
            title='Gestionar Características'
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(25, 118, 210, 0.04)',
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
            <Box>
              {state.loadingAll && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Cargando características...</Typography>
                </Box>
              )}

              <Typography variant='h6' gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                🔧 Características
              </Typography>

              {state.characteristics.length > 0 ? (
                <Grid container spacing={6} sx={{ mb: 6 }}>
                  {state.characteristics.map(characteristic => (
                    <Grid key={characteristic.id} size={{ xs: 12, sm: 12 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>{renderInputField(characteristic)}</Box>
                        <IconButton
                          color='error'
                          onClick={() => handleRemoveCharacteristic(characteristic.id)}
                          sx={{ mt: 1 }}
                          size='small'
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
                Agregar característica
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl fullWidth>
                  <InputLabel id='add-characteristic-label'>Seleccionar Característica</InputLabel>
                  <Select
                    labelId='add-characteristic-label'
                    value={state.selectedCharacteristic}
                    onChange={e => setState(prev => ({ ...prev, selectedCharacteristic: e.target.value }))}
                    label='Seleccionar Característica'
                    disabled={state.loadingAll || state.availableCharacteristics.length === 0}
                  >
                    {state.availableCharacteristics.map((char: ICharacteristic) => (
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
                  disabled={!state.selectedCharacteristic || state.loadingAll}
                  sx={{ minWidth: 'auto', px: 3 }}
                >
                  Agregar
                </Button>
              </Box>

              {state.availableCharacteristics.length === 0 && !state.loadingAll && (
                <Typography variant='body2' color='text.secondary' sx={{ mt: 2, fontStyle: 'italic' }}>
                  No hay características disponibles para agregar
                </Typography>
              )}
            </Box>
          </CardContent>
          <CardActions className='flex justify-end'>
            <Button variant='contained' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant='contained' color='primary' onClick={onSubmit}>
              Guardar
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  )
}

export default SearchCharacteristicModalV2
