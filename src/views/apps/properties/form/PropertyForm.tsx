'use client'

import React, { useState, useEffect } from 'react'

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

import TextField from '@/components/form/TextField'
import SelectField from '@/components/form/SelectField'
import EditorField from '@/components/form/EditorField'
import NumberField from '@/components/form/NumberField'
import ImageField from '@/components/form/ImageField'
import SelectFieldAsync from '@/components/form/SelectFieldAsync'
import DirectionalIcon from '@components/DirectionalIcon'

import StepperWrapper from '@core/styles/stepper'
import type { ResponseAPI } from '@/api/repositories/BaseRepository'
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
  const { baseForm, validateFirstStep, validateSecondStep, handleChangeImages } = usePropertyForm(propertyId)
  const { control, handleSubmit, errors, isSubmitting, setValue, watch } = baseForm
  const { notify } = useNotification()
  const [images, setImages] = useState<IImage[]>([])

  // Obtenemos las funciones de API para las imágenes
  const { uploadImages, deleteImage, updateImagesOrder, getAllImages, updateCharacteristic } = useProperties()

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

  const handleGetAllImages = async () => {
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
  }

  // useEffect para manejar los disabled de precio y precio de alquiler basandose en Tipo de Negociacion
  const typeNegotiationValue = watch('type_negotiation_id')

  useEffect(() => {
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
  }, [typeNegotiationValue, setValue, setDisabledPrice, setDisabledRentPrice])

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
            const characteristics = watch('characteristics')

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

  const handleUpdateImagesOrder = async (images: any[]) => {
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
  }

  // Handler for characteristic changes


  // Try/catch to avoid any potential issues with characteristics
  const CharacteristicsWrapper = React.useMemo(() => {
    const handleCharacteristicsChange = (characteristics: any[]) => {

      console.log('handleCharacteristicsChange', characteristics)

      // Only update if necessary to prevent render loops
      const currentChars = watch('characteristics')

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
          <PropertyCharacteristics propertyId={propertyId} control={control} onChange={handleCharacteristicsChange} />
        )
      } catch (error) {
        console.error('Error rendering PropertyCharacteristics:', error)

        return <Typography color='error'>Error loading characteristics</Typography>
      }
    }
  }, [propertyId, control, setValue, watch])

  // Create a separate component for images to avoid interference with characteristics
  const PropertyImages = React.useMemo(() => {
    return () => (
      <Box sx={{ mt: 2, mb: 4 }}>
        <ImageField
          name='images'
          label='Imagenes'
          control={control}
          multiple={true}
          error={errors.images as any}
          setValue={setValue}
          value={images}
          onChange={handleChangeImages}
          deleteItem={id => deleteImage(id).then(() => {})}
          refreshData={handleGetAllImages}
          onReorder={handleUpdateImagesOrder}
        />
      </Box>
    )
  }, [
    control,
    errors.images,
    images,
    setValue,
    uploadImages,
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

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <>
            {/* Información básica */}

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name='name'
                label='Nombre de la Propiedad'
                control={control}
                error={errors.name}
                setValue={setValue}
                value={watch('name')}
              />
            </Grid>


            <Grid size={{ xs: 12, sm: 3 }}>
              <SelectField
                name='status_id'
                label='Estatus'
                control={control}
                error={errors.status_id}
                setValue={setValue}
                value={watch('status_id')}
                response={statuses}
                dataMap={{ value: 'id', label: 'name' }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <SelectField
                name='type_property_id'
                label='Tipo de Propiedad'
                control={control}
                error={errors.type_property_id}
                setValue={setValue}
                value={watch('type_property_id')}
                response={propertyTypes}
                dataMap={{ value: 'id', label: 'name' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectFieldAsync
                name='state_id'
                label='Estado'
                control={control}
                error={errors.state_id}
                setValue={setValue}
                value={watch('state_id')}
                response={states}
                dataMap={{ value: 'id', label: 'name' }}
                onChange={(e) => handleChangeState(e)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectFieldAsync
                name='city_id'
                label='Ciudad'
                control={control}
                error={errors.city_id}
                setValue={setValue}
                value={watch('city_id')}
                response={cities}
                dataMap={{ value: 'id', label: 'name' }}
                isDisabled={!watch('state_id')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name='address'
                label='Dirección'
                control={control}
                error={errors.address}
                setValue={setValue}
                value={watch('address')}
              />
            </Grid>
          </>
        )
      case 1:
        return (
          <>
            {/* Datos de Negociacion */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name='franchise_id'
                label='Franquicia'
                control={control}
                error={errors.franchise_id}
                setValue={setValue}
                value={watch('franchise_id')}
                response={franchises}
                dataMap={{ value: 'id', label: 'name' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name='assigned_to_id'
                label='Usuario Asignado'
                control={control}
                error={errors.assigned_to_id}
                setValue={setValue}
                value={watch('assigned_to_id')}
                response={users}
                dataMap={{ value: 'id', label: 'email' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectField
                name='type_negotiation_id'
                label='Tipo de Negociación'
                control={control}
                error={errors.type_negotiation_id}
                setValue={setValue}
                value={watch('type_negotiation_id')}
                response={negotiations}
                dataMap={{ value: 'id', label: 'name' }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <NumberField
                name='price'
                label='Precio'
                control={control}
                error={errors.price}
                setValue={setValue}
                value={watch('price')}
                disabled={disabledPrice}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <NumberField
                name='rent_price'
                label='Precio de Alquiler'
                control={control}
                error={errors.rent_price}
                setValue={setValue}
                value={watch('rent_price')}
                disabled={disabledRentPrice}
              />
            </Grid>
            <ModalClient />
            <Box sx={{ width: '100%', display: 'flex', gap: '1rem', alignItems: 'center', mt: 4 }}>
              <Grid size={{ xs: 12, sm: 12 }}>
                <SelectFieldAsync
                  name='owner_id'
                  label='Cliente'
                  control={control}
                  error={errors.owner_id}
                  setValue={setValue}
                  value={watch('owner_id')}
                  response={clients}
                  dataMap={{ value: 'id', label: 'name' }}
                  refreshData={refreshClients}
                >
                  <MenuItem onClick={handleButtonModal}>
                    <i className='tabler-user-plus' /> Crear un nuevo cliente
                  </MenuItem>
                  <Divider />
                </SelectFieldAsync>
              </Grid>
            </Box>
          </>
        )
      case 2:
        return (
          <>
            {/* Datos de Publicacion */}
            <Grid size={{ xs: 12 }} container spacing={4}>
              {/* Left column - Main content (Description and Images) */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12 }}>
                    <Card sx={{ height: '100%', bgcolor: 'action.hover' }}>
                      <CardContent>
                        <EditorField
                          name='description'
                          label='Descripción'
                          control={control}
                          error={errors.description}
                          setValue={setValue}
                          value={watch('description')}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/** Imagenes  */}
                  <Grid size={{ xs: 12 }}>{activeStep === 2 && <PropertyImages />}</Grid>
                </Grid>
              </Grid>

              {/* Right column - Sidebar (Characteristics) */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', bgcolor: 'action.hover' }}>
                  <CardContent>{activeStep === 2 && <CharacteristicsWrapper />}</CardContent>
                </Card>
              </Grid>
            </Grid>
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
