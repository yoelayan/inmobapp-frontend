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
import CustomAvatar from '@core/components/mui/Avatar'

import DirectionalIcon from '@components/DirectionalIcon'
import { Form, FormField } from '@components/common/forms/Form'
import PropertiesRepository from '@services/repositories/realstate/PropertiesRepository'
import {
  createPropertySchema,
  editPropertySchema,
  defaultPropertyValues,
  type CreatePropertyFormData,
  type EditPropertyFormData
} from '@/validations/propertySchema'

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
  const { notify } = useNotification()
  const [images, setImages] = useState<IImage[]>([])

  const handleSuccess = (property: CreatePropertyFormData | EditPropertyFormData) => {
    console.log(`Propiedad ${propertyId ? 'actualizada' : 'creada'}:`, property)
    notify(`Propiedad ${propertyId ? 'actualizada' : 'creada'} correctamente`, 'success')
  }

  const handleError = (error: any) => {
    console.error('Error en el formulario de propiedad:', error)
  }

  const setFormData = (data: any, methods: any) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'characteristics' && Array.isArray(value)) {
        methods.setValue(key, value)
      } else if (key === 'images' && Array.isArray(value)) {
        methods.setValue(key, value)
        setImages(value as IImage[])
      } else {
        methods.setValue(key, value)
      }
    })
  }

  const schema = propertyId ? editPropertySchema : createPropertySchema

  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(propertyId ? 2 : 0)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = useState(false)

  const handleButtonModal = () => {
    setOpen(!open)
  }

  const ModalClient = () => {
    const handleSuccess = (response: IClient) => {
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
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleChangeState = (e: any) => {
    if (e.value) {
      refreshCities({ state: e.value })
    }
  }

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <>
            {/* Información General */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField name='name' label='Nombre de la Propiedad' required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField name='code' label='Código' fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name='status_id'
                type='select'
                label='Estatus'
                required
                fullWidth
                options={
                  statuses?.results?.map(status => ({
                    value: status.id,
                    label: status.name
                  })) || []
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name='type_property_id'
                type='select'
                label='Tipo de Propiedad'
                required
                fullWidth
                options={
                  propertyTypes?.results?.map(type => ({
                    value: type.id,
                    label: type.name
                  })) || []
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name='state_id'
                type='select'
                label='Estado'
                required
                fullWidth
                options={
                  states?.results?.map(state => ({
                    value: state.id,
                    label: state.name
                  })) || []
                }
                onChange={e => {
                  const value = typeof e === 'object' && e?.target ? e.target.value : e
                  handleChangeState({ value: Number(value) })
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name='city_id'
                type='select'
                label='Ciudad'
                required
                fullWidth
                options={
                  cities?.results?.map(city => ({
                    value: city.id,
                    label: city.name
                  })) || []
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField name='address' label='Dirección' required fullWidth />
            </Grid>
          </>
        )
      case 1:
        return (
          <>
            {/* Datos de Negociacion */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name='franchise_id'
                type='select'
                label='Franquicia'
                required
                fullWidth
                options={
                  franchises?.results?.map(franchise => ({
                    value: franchise.id,
                    label: franchise.name
                  })) || []
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name='assigned_to_id'
                type='select'
                label='Usuario Asignado'
                required
                fullWidth
                options={
                  users?.results?.map(user => ({
                    value: user.id,
                    label: user.name
                  })) || []
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name='type_negotiation_id'
                type='select'
                label='Tipo de Negociación'
                required
                fullWidth
                options={
                  negotiations?.results?.map(negotiation => ({
                    value: negotiation.id,
                    label: negotiation.name
                  })) || []
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormField name='initial_price' type='number' label='Precio Inicial' required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormField name='price' type='number' label='Precio de Venta' fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormField name='rent_price' type='number' label='Precio de Alquiler' fullWidth />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField
                name='owner_id'
                type='select'
                label='Cliente'
                fullWidth
                options={
                  clients?.results?.map(client => ({
                    value: client.id,
                    label: client.name
                  })) || []
                }
              />
            </Grid>
          </>
        )
      case 2:
        return (
          <>
            {/* Datos de Publicacion */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Características y Presentación
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Esta sección será implementada próximamente con características dinámicas e imágenes.
              </Typography>
            </Grid>
          </>
        )
      default:
        return null
    }
  }

  const handleStep = (index: number) => {
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
            <Form
              schema={schema}
              defaultValues={defaultPropertyValues}
              repository={PropertiesRepository}
              mode={propertyId ? 'edit' : 'create'}
              entityId={propertyId ? Number(propertyId) : undefined}
              onSuccess={handleSuccess}
              onError={handleError}
              setFormData={setFormData}
            >
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
                  <Button
                    type='submit'
                    variant='contained'
                    onClick={handleNext}
                    endIcon={
                      activeStep === steps.length - 1 ? (
                        <i className='tabler-check' />
                      ) : (
                        <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                      )
                    }
                  >
                    {activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </CardContent>
      </Card>
      <ModalClient />
    </>
  )
}

export default PropertyForm