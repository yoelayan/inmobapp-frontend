'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { styled, useTheme } from '@mui/material/styles'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid2 as Grid,
  Box,
  IconButton,
  Stepper,
  Divider,
  StepLabel,
  Typography,
  MenuItem,
  Modal
} from '@mui/material'

import MuiStep from '@mui/material/Step'
import CloseIcon from '@mui/icons-material/Close'

// Formulario de cliente
import useMediaQuery from '@mui/material/useMediaQuery'
import classnames from 'classnames'

import type { StepProps } from '@mui/material/Step'

import { ClientForm } from '../../clients/form/ClientForm'
import { usePropertyForm } from './hooks/usePropertyForm'
import CustomAvatar from '@core/components/mui/Avatar'

import DirectionalIcon from '@components/DirectionalIcon'

import StepperWrapper from '@core/styles/stepper'
import type { ResponseAPI } from '@/types/api/response'
import type { IClient } from '@/types/apps/ClientesTypes'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import type { IUser } from '@/types/apps/UserTypes'
import type { IGeoItem } from '@/types/apps/LocationsTypes'
import type { IStatus } from '@/types/apps/CatalogTypes'
import type { IImage } from '@/types/apps/RealtstateTypes'
import { useNotification } from '@/hooks/useNotification'
import useProperties from '@/hooks/api/realstate/useProperties'

// Import the new PropertyCharacteristics component
import PropertyCharacteristics from './components/PropertyCharacteristics'

interface PropertyFormProps {
  propertyId?: string // ID opcional para modo edición
  franchises: ResponseAPI<IFranchise> | null // Lista de franquicias
  users: ResponseAPI<IUser> | null // Lista de usuarios
  statuses: ResponseAPI<IStatus> | null // Lista de estados
  negotiations: ResponseAPI<IStatus> | null // Tipos de negociación
  propertyTypes: ResponseAPI<IStatus> | null // Tipos de propiedad
  states: ResponseAPI<IGeoItem> | null // Lista de estados
  cities: ResponseAPI<IGeoItem> | null // Lista de ciudades
  refreshCities: (filters?: Record<string, any>) => Promise<void>
  clients: ResponseAPI<IClient> | null // Lista de clientes
  refreshClients: (filters?: Record<string, any>) => Promise<void>
}

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  paddingInline: theme.spacing(7),
  '&:first-of-type': {
    paddingLeft: 0
  },
  '&:last-of-type': {
    paddingRight: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '&.Mui-completed .step-title , &.Mui-completed .step-subtitle': {
    color: 'var(--mui-palette-text-disabled)'
  },

  [theme.breakpoints.down('md')]: {
    padding: 0,
    ':not(:last-of-type)': {
      marginBlockEnd: theme.spacing(6)
    }
  }
}))

const steps = [
  // 4 steps title and description
  {
    icon: 'tabler-home',

    title: 'Información General',
    description: 'Información básica de la propiedad'
  },
  {
    icon: 'tabler-currency-dollar',

    title: 'Datos Negociación',
    description: 'Precios y Datos del propietario'
  },
  {
    icon: 'tabler-file-description',
    title: 'Datos de publicación',
    description: 'Caracteristicas y Presentación de la propiedad'
  }
]

export const PropertyForm: React.FC<PropertyFormProps> = ({
  propertyId,
  franchises,
  users,
  statuses,
  negotiations,
  propertyTypes,
  states,
  cities,
  clients,
  refreshClients,
  refreshCities,
}) => {
  console.log('render')
  const { baseForm, validateFirstStep, validateSecondStep, handleChangeImages } = usePropertyForm(propertyId)
  const { control, handleSubmit, errors, isSubmitting, setValue, watch, getValues } = baseForm
  const { notify } = useNotification()
  const [images, setImages] = useState<IImage[]>([])

  // Obtenemos las funciones de API para las imágenes
  const {deleteImage, updateImagesOrder, getAllImages, updateCharacteristic } = useProperties()

  // disabled de inputs, useState
  const [disabledPrice, setDisabledPrice] = useState(false)
  const [disabledRentPrice, setDisabledRentPrice] = useState(false)

  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(propertyId ? 2 : 0)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = useState(false)

  const handleButtonModal = () => {
    setOpen(!open)
  }


  const handleGetAllImages = useCallback(async () => {
    if (!propertyId) {
      return
    }

    console.log('handleGetAllImages', propertyId)

    try {
      const response = await getAllImages(propertyId)

      // Check if response has results property (ResponseAPI format)
      if (response && typeof response === 'object' && 'results' in response) {
        // Handle ResponseAPI format
        setValue('images', response.results as IImage[])
      } else if (Array.isArray(response)) {
        // Handle array format
        setValue('images', response as IImage[])
      } else {
        // Handle other formats - empty array as fallback
        setValue('images', [])
      }

      console.log('PropertyForm: All images:', response)
    } catch (error) {
      console.error('Error fetching images:', error)
      notify('Error al cargar las imágenes', 'error')
    }
  }, [propertyId, notify, getAllImages, setValue])

  // useEffect para procesar imágenes cuando se carga el componente
  useEffect(() => {
    if (propertyId) {
      console.log('PropertyForm: Fetching property data with images')
    }
  }, [propertyId])

  // Opcional: Log para depurar qué datos de imágenes están siendo usados
  const imagesValue = watch('images')

  useEffect(() => {
    if (imagesValue) {
      setImages(Array.isArray(imagesValue) ? (imagesValue as IImage[]) : [])
    }
  }, [imagesValue])

  // Now we need to add an effect to load characteristics when reaching step 3
  useEffect(() => {
    // Only load characteristics when at step 3 (index 2) and we have a propertyId
    if (activeStep === 2 && propertyId) {
      // If this property already exists, let's load its characteristics
      console.log('Loading characteristics for property:', propertyId)

      // This will be handled by the PropertyCharacteristics component
    }
  }, [activeStep, propertyId])

  const ModalClient = () => {
    const handleSuccess = (response: IClient) => {
      setValue('owner_id', response.id)

      refreshClients()

      handleButtonModal()
    }

    return (
      <Modal
        key='modal-client'
        open={open}
        onClose={handleButtonModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Card
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '800px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <CardContent>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography id='modal-modal-title' variant='h5' component='h2'>
                  Crear Cliente
                </Typography>
                <IconButton onClick={handleButtonModal}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <ClientForm
                statuses={statuses}
                franchises={franchises}
                users={users}
                onSuccess={(response: IClient) => {
                  handleSuccess(response)
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Modal>
    )
  }

  const handleReset = () => {
    // reset()
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleNext = async () => {
    switch (activeStep) {
      case 0:
        if (!validateFirstStep()) {
          notify('Por favor, complete todos los campos requeridos', 'error')

          return
        }

        if (propertyId) {
          await handleSubmit()
        }

        break
      case 1:
        if (!validateSecondStep()) {
          notify('Por favor, complete todos los campos requeridos', 'error')

          return
        }

        await handleSubmit()

        break
      case 2:
        // On the last step, we ensure all data is saved together (including characteristics)
        handleSubmit().then(() => {
          // Save characteristics only if there's a propertyId
          if (propertyId) {
            const characteristics = getValues('characteristics')

            if (characteristics && characteristics.length > 0) {
              // Make sure the characteristics array matches the expected type

              // Save characteristics using updateCharacteristic
              updateCharacteristic(propertyId, characteristics)
                .then(() => {
                  notify('Características guardadas correctamente', 'success')
                })
                .catch(error => {
                  console.error('Error saving characteristics:', error)
                  notify('Error al guardar características', 'error')
                })
            }
          }
        })

        // Don't advance past the last step
        return
      default:
        break
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleUpdateImagesOrder = useCallback(async (images: any[]) => {
    if (!propertyId) {
      notify('Debe guardar la propiedad antes de reordenar imágenes', 'warning')

      return
    }

    try {
      await updateImagesOrder(propertyId, images)
      notify('Orden de imágenes actualizado correctamente', 'success')
    } catch (error) {
      console.error('Error al actualizar el orden de las imágenes:', error)
      notify('Error al actualizar el orden de las imágenes', 'error')
    }
  }, [propertyId, notify, updateImagesOrder])

  // Handler for characteristic changes

  // Try/catch to avoid any potential issues with characteristics
  const CharacteristicsWrapper = React.useMemo(() => {
    const handleCharacteristicsChange = (characteristics: any[]) => {
      console.log('handleCharacteristicsChange', characteristics)

      // Only update if necessary to prevent render loops
      const currentChars = getValues('characteristics')

      // Deep comparison instead of reference comparison
      if (JSON.stringify(currentChars) === JSON.stringify(characteristics)) {
        return
      }


      setValue('characteristics', characteristics)
    }

    console.log('CharacteristicsWrapper', propertyId)

    return () => {
      try {
        return (
          <PropertyCharacteristics propertyId={propertyId} control={control} getValues={getValues} setValue={setValue} onChange={handleCharacteristicsChange} />
        )
      } catch (error) {
        console.error('Error rendering PropertyCharacteristics:', error)

        return <Typography color='error'>Error loading characteristics</Typography>
      }
    }
  }, [propertyId, control, setValue, getValues])

  // Create a separate component for images to avoid interference with characteristics
  const PropertyImages = React.useMemo(() => {
    return () => (
      <Box sx={{ mt: 2, mb: 4 }}>

      </Box>
    )
  }, [
    control,
    errors.images,
    images,
    setValue,
    deleteImage,
    handleChangeImages,
    handleGetAllImages,
    handleUpdateImagesOrder
  ])

  const handleChangeState = (e: any) => {
    setValue('city_id', undefined)

    if (e.value) {
      refreshCities({ state: e.value })
    }
  }

  const handleChangeTypeNegotiation = (e: any) => {
    if (!e) {
      setValue('price', 0)
      setValue('rent_price', 0)
      setDisabledPrice(true)
      setDisabledRentPrice(true)

return;
    }

    const typeNegotiationValue = e.value

      // 1: Venta, 2: Alquiler, 3: Venta y Alquiler
      if (typeNegotiationValue) {
        if (typeNegotiationValue === 1) {
          setValue('rent_price', 0)
          setDisabledPrice(false)
          setDisabledRentPrice(true)
        } else if (typeNegotiationValue === 2) {
          setValue('price', 0)

          setDisabledPrice(true)
          setDisabledRentPrice(false)
        } else if (typeNegotiationValue === 3) {
          setDisabledPrice(false)
          setDisabledRentPrice(false)
        }
      }

  }

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <>

          </>
        )
      case 1:
        return (
          <>
            {/* Datos de Negociacion */}

          </>
        )
      case 2:
        return (
          <>
            {/* Datos de Publicacion */}

          </>
        )
      default:
        return null
    }
  }

  // Render condicional para carga inicial

  const handleStep = (index: number) => {
    // solo se puede mover el paso si es actualizacion
    if (propertyId) {
      setActiveStep(index)
    } else {
      notify('Complete el paso 1 y 2 para poder escoger entre pasos', 'warning')
    }
  }

  return (
    <>
      <Card>
        <CardHeader title={propertyId ? 'Actualizar Propiedad' : 'Crear Propiedad'} />
        <StepperWrapper className='m-4'>
          <Stepper
            activeStep={activeStep}
            connector={
              !isSmallScreen ? (
                <DirectionalIcon
                  ltrIconClass='tabler-chevron-right'
                  rtlIconClass='tabler-chevron-left'
                  className='text-xl'
                />
              ) : null
            }
          >
            {steps.map((step, index) => {
              return (
                <Step key={index} onClick={() => handleStep(index)}>
                  <StepLabel>
                    <div className='step-label'>
                      <CustomAvatar
                        variant='rounded'
                        skin={activeStep === index ? 'filled' : 'light'}
                        {...(activeStep >= index && { color: 'primary' })}
                        {...(activeStep === index && { className: 'shadow-primarySm' })}
                        size={38}
                      >
                        <i className={classnames(step.icon)} />
                      </CustomAvatar>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.description}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
        <Divider sx={{ m: '0 !important' }} />
        <CardContent>
          {activeStep === steps.length ? (
            <>
              <Typography className='mlb-2 mli-1'>All steps are completed!</Typography>
              <div className='flex justify-end mt-4'>
                <Button variant='contained' onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={e => e.preventDefault()}>
                <Grid container spacing={6}>
                  {renderStepContent(activeStep)}
                  <Grid size={{ xs: 12 }} className='flex justify-between'>
                    <Button
                      variant='tonal'
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      color='secondary'
                      startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
                    >
                      Anterior
                    </Button>
                    {/* Botón de envío */}

                    <Button
                      type='submit'
                      variant='contained'
                      disabled={isSubmitting}
                      onClick={handleNext}
                      endIcon={
                        activeStep === steps.length - 1 ? (
                          <i className='tabler-check' />
                        ) : (
                          <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                        )
                      }
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : null}
                      {/** Si es crear y es el primer paso == "Crear"
                       * El resto de pasos == "Guardar"
                       */}
                      {activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default PropertyForm
