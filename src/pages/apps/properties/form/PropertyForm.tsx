import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import classnames from 'classnames'

import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  Typography,
  Grid2 as Grid,
  Stepper,
  Step as MuiStep,
  StepLabel,
  useMediaQuery
} from '@mui/material'

import { styled } from '@mui/material/styles'

import type { StepProps } from '@mui/material/Step'

import usePropertyStatus from '@hooks/api/realstate/usePropertyStatus'

import usePropertyTypes from '@hooks/api/realstate/usePropertyTypes'

import useStates from '@hooks/api/locations/useStates'

import useCities from '@hooks/api/locations/useCities'

import useFranchises from '@hooks/api/realstate/useFranchises'

import useUsers from '@hooks/api/users/useUsers'

import usePropertyNegotiation from '@hooks/api/realstate/usePropertyNegotiation'

import useClients from '@hooks/api/crm/useClients'

import { Form, FormField } from '@components/common/forms/Form'
import CustomAvatar from '@core/components/mui/Avatar'
import DirectionalIcon from '@components/DirectionalIcon'
import StepperWrapper from '@core/styles/stepper'

import PropertiesRepository from '@services/repositories/realstate/PropertiesRepository'
import { useNotification } from '@hooks/useNotification'

import {
  createPropertySchema,
  editPropertySchema,
  defaultPropertyValues,
  step1Schema,
  step2Schema,
  step3Schema,
  type CreatePropertyFormData,
  type EditPropertyFormData
} from '@/validations/propertySchema'

interface PropertyFormProps {
  mode?: 'create' | 'edit'
  propertyId?: number
  onSuccess?: (property: CreatePropertyFormData | EditPropertyFormData) => void
}

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

const PropertyForm = ({ mode = 'create', propertyId, onSuccess }: PropertyFormProps) => {
  const { notify } = useNotification()
  const [activeStep, setActiveStep] = useState(0)
  const isSmallScreen = useMediaQuery('(max-width: 600px)')

  /* Data */

  const { loading: statusesLoading, data: statuses, fetchData: fetchStatuses } = usePropertyStatus()
  const { loading: negotiationsLoading, data: negotiations, fetchData: fetchNegotiations } = usePropertyNegotiation()
  const { loading: propertyTypesLoading, data: propertyTypes, fetchData: fetchPropertyTypes } = usePropertyTypes()
  const { loading: statesLoading, data: states, fetchData: fetchStates } = useStates()
  const { loading: citiesLoading, data: cities, fetchData: fetchCities } = useCities()
  const { loading: franchisesLoading, data: franchises, fetchData: fetchFranchises } = useFranchises()
  const { loading: usersLoading, data: users, fetchData: fetchUsers } = useUsers()
  const { loading: clientsLoading, data: clients, fetchData: fetchClients } = useClients()

  useEffect(() => {
    fetchStatuses()
    fetchNegotiations()
    fetchPropertyTypes()
    fetchStates()
    fetchCities()
    fetchFranchises()
    fetchUsers()
    fetchClients()
  }, [
    fetchStatuses,
    fetchNegotiations,
    fetchPropertyTypes,
    fetchStates,
    fetchCities,
    fetchFranchises,
    fetchUsers,
    fetchClients
  ])

  /* Steps Control */

  const handleStep = (index: number) => {
    if (propertyId) {
      setActiveStep(index)
    } else {
      notify('Complete el paso 1 y 2 para poder escoger entre pasos', 'warning')
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const getCurrentStepSchema = () => {
    switch (activeStep) {
      case 0:
        return step1Schema
      case 1:
        return step2Schema
      case 2:
        return step3Schema
      default:
        return step1Schema
    }
  }

  const handleNext = async () => {
    // Si estamos en el paso 2 (último paso antes de la publicación),
    // necesitamos crear la propiedad antes de avanzar
    if (activeStep === 1) {
      // En el paso 2, el botón será de tipo submit para crear la propiedad
      // No necesitamos hacer nada aquí, el formulario se enviará automáticamente
      return
    }

    // Para los otros pasos, simplemente avanzar
    if (activeStep < steps.length - 1) {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const getFormData = () => {
    // Esta función ya no es necesaria
    return {}
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const schema = propertyId ? editPropertySchema : createPropertySchema

  const handleSuccess = (property: CreatePropertyFormData | EditPropertyFormData) => {
    console.log(`Propiedad ${mode === 'edit' ? 'actualizada' : 'creada'}:`, property)

    // Si estamos en modo creación y acabamos de crear la propiedad, avanzar al paso 3
    if (mode === 'create' && activeStep === 1) {
      setActiveStep(2)
      notify('Propiedad creada exitosamente. Ahora puedes agregar características e imágenes.', 'success')
    } else {
      // Para otros casos, llamar al callback onSuccess
      onSuccess?.(property)
    }
  }

  const handleError = (error: any) => {
    console.error('Error en el formulario:', error)
  }

  const setFormData = (data: any, methods: any) => {
    Object.entries(data).forEach(([key, value]) => {
      methods.setValue(key, value)
    })
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
              <Typography variant='h6' gutterBottom>
                Características y Presentación
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Esta sección será implementada próximamente con características dinámicas e imágenes.
              </Typography>
            </Grid>
          </>
        )
      default:
        return null
    }
  }

  return (
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
                  type={activeStep === 1 || activeStep === steps.length - 1 ? 'submit' : 'button'}
                  variant='contained'
                  onClick={activeStep === 1 || activeStep === steps.length - 1 ? undefined : handleNext}
                  endIcon={
                    activeStep === steps.length - 1 ? (
                      <i className='tabler-check' />
                    ) : (
                      <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                    )
                  }
                >
                  {activeStep === steps.length - 1 ? 'Guardar' : activeStep === 1 ? 'Crear Propiedad' : 'Siguiente'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

export default PropertyForm
