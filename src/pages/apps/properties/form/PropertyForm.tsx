import { useEffect, useState, useRef, memo } from 'react'

import type { FilterItem } from '@/types/api/response'


import { useFormContext } from 'react-hook-form'

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
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box
} from '@mui/material'

import { styled } from '@mui/material/styles'

import type { StepProps } from '@mui/material/Step'

import usePropertyStatus from '@hooks/api/realstate/usePropertyStatus'
import usePropertyTypes from '@hooks/api/realstate/usePropertyTypes'


import usePropertyNegotiation from '@hooks/api/realstate/usePropertyNegotiation'

import useClients from '@hooks/api/crm/useClients'
import useClientStatus from '@hooks/api/crm/useClientStatus'
import useUsers from '@hooks/api/users/useUsers'
import useFranchises from '@hooks/api/realstate/useFranchises'

import { Form, FormField } from '@components/common/forms/Form'
import { ClientForm } from '@/pages/apps/clients/form/ClientForm'
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
  step3Schema,
  step1PartialSchema,
  step2PartialSchema,
  type CreatePropertyFormData,
  type EditPropertyFormData
} from '@/validations/propertySchema'

import StatesRepository from '@/services/repositories/locations/StatesRepository'
import MunicipalitiesRepository from '@/services/repositories/locations/MunicipalitiesRepository'
import ParishesRepository from '@/services/repositories/locations/ParishesRepository'
import ClientsRepository from '@/services/repositories/crm/ClientsRepository'
import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'
import UsersRepository from '@/services/repositories/users/UsersRepository'

interface PropertyFormProps {
  mode?: 'create' | 'edit'
  propertyId?: number
  onSuccess?: (property: CreatePropertyFormData | EditPropertyFormData) => void
}

const steps = [
  { icon: 'tabler-home', title: 'Información General', description: 'Información básica de la propiedad' },
  { icon: 'tabler-currency-dollar', title: 'Datos Negociación', description: 'Precios y Datos del propietario' },
  {
    icon: 'tabler-file-description',
    title: 'Datos de publicación',
    description: 'Caracteristicas y Presentación de la propiedad'
  }
]

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  paddingInline: theme.spacing(7),
  '&:first-of-type': { paddingLeft: 0 },
  '&:last-of-type': { paddingRight: 0 },
  '& .MuiStepLabel-iconContainer': { display: 'none' },
  '&.Mui-completed .step-title , &.Mui-completed .step-subtitle': {
    color: 'var(--mui-palette-text-disabled)'
  },
  [theme.breakpoints.down('md')]: {
    padding: 0,
    ':not(:last-of-type)': { marginBlockEnd: theme.spacing(6) }
  }
}))


const Step1Content = memo(() => {
  console.log('re-render')
  const { data: statuses, fetchData: fetchStatuses } = usePropertyStatus()
  const { data: propertyTypes, fetchData: fetchPropertyTypes } = usePropertyTypes()
  const [ municipalitiesFilters, setMunicipalitiesFilters ] = useState<FilterItem[]>([])

  useEffect(() => {
    fetchStatuses()
    fetchPropertyTypes()
  }, [fetchStatuses, fetchPropertyTypes])


  // watch
  const { watch } = useFormContext()
  const state = watch('state_id')
  const municipality = watch('municipality_id')


  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField name='name' label='Nombre de la Propiedad' required fullWidth />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormField
          name='status_id'
          type='select'
          label='Estatus'
          required
          fullWidth
          options={statuses?.results?.map(status => ({ value: status.id, label: status.name })) || []}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormField
          name='type_property_id'
          type='select'
          label='Tipo de Propiedad'
          required
          fullWidth
          options={propertyTypes?.results?.map(type => ({ value: type.id, label: type.name })) || []}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <FormField
          type='async-select'
          name='state_id'
          label='Estado'
          required
          repository={StatesRepository}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <FormField
          type='async-select'
          name='municipality_id'
          label='Municipio'
          required
          repository={MunicipalitiesRepository}
          filters={state && state.value ? [{ field: 'state', value: state.value }] : []}
          disabled={!state || !state.value}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormField
          type='async-select'
          name='parish_id'
          label='Parroquia'
          required
          repository={ParishesRepository}
          filters={state && municipality ? [{ field: 'municipality', value: municipality?.value }] : []}
          disabled={!state || !municipality}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField name='code'
          label='Código'
          fullWidth
          required
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormField name='address'
          label='Dirección'
          required={false}
          fullWidth
        />
      </Grid>
    </>
  )
})

const PropertyForm = ({ mode = 'create', propertyId, onSuccess }: PropertyFormProps) => {
  const { notify } = useNotification()
  const [activeStep, setActiveStep] = useState(0)

  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [newlyCreatedClient, setNewlyCreatedClient] = useState<any>(null)
  const isSmallScreen = useMediaQuery('(max-width: 600px)')

  /* Data */

  const { loading: negotiationsLoading, data: negotiations, fetchData: fetchNegotiations } = usePropertyNegotiation()
  const { loading: clientsLoading, data: clients, fetchData: fetchClients } = useClients()
  const { loading: clientStatusLoading, data: clientStatuses, fetchData: fetchClientStatuses } = useClientStatus()
  const { loading: usersLoading, data: users, fetchData: fetchUsers } = useUsers()
  const { loading: franchisesLoading, data: franchises, fetchData: fetchFranchises } = useFranchises()


  // Cargar datasets una sola vez (evita loops por identidades inestables)
  const didInitRef = useRef(false)

  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true

    fetchNegotiations()

    fetchClients()
    fetchClientStatuses()
    fetchUsers()
    fetchFranchises()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Modal crear cliente
  const handleOpenClientModal = () => {
    if (!users || !franchises || !clientStatuses) {
      fetchUsers()
      fetchFranchises()
      fetchClientStatuses()
    }

    setIsClientModalOpen(true)
  }

  const handleCloseClientModal = () => setIsClientModalOpen(false)

  const handleClientCreated = (newClient: any) => {
    setIsClientModalOpen(false)
    fetchClients()
    setNewlyCreatedClient(newClient)
    notify(`Cliente "${newClient.name}" creado exitosamente`, 'success')
  }

  // Campos de precio según negociación
  const NegotiationPriceFields = () => {
    const { watch, setValue } = useFormContext()
    const negotiationTypeId = watch('type_negotiation_id')

    const showSalePrice = negotiationTypeId === 1 || negotiationTypeId === 3
    const showRentPrice = negotiationTypeId === 2 || negotiationTypeId === 3

    useEffect(() => {
      if (negotiationTypeId) {
        if (!showSalePrice) setValue('price', '')
        if (!showRentPrice) setValue('rent_price', '')
      }
    }, [negotiationTypeId, showSalePrice, showRentPrice, setValue])

    return (
      <>
        {showSalePrice && (
          <Grid size={{ xs: 12, md: showRentPrice ? 6 : 6 }}>
            <FormField
              name='price'
              type='number'
              label='Precio de Venta'
              required={negotiationTypeId === 1}
              fullWidth
            />
          </Grid>
        )}
        {showRentPrice && (
          <Grid size={{ xs: 12, md: showSalePrice ? 6 : 6 }}>
            <FormField
              name='rent_price'
              type='number'
              label='Precio de Alquiler'
              required={negotiationTypeId === 2}
              fullWidth
            />
          </Grid>
        )}
        {!negotiationTypeId && (
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic', p: 2 }}>
              Selecciona un tipo de negociación para configurar los precios
            </Typography>
          </Grid>
        )}
      </>
    )
  }

  // Paso 1

  /* Steps Control */
  const handleStep = (index: number) => {
    if (propertyId) {
      setActiveStep(index)
    } else {
      if (index === 0) setActiveStep(0)
      else if (index === 1) notify('Complete el paso 1 primero', 'warning')
      else if (index === 2) {
        if (!propertyId) notify('Debe crear la propiedad en el paso 2 antes de continuar', 'warning')
        else setActiveStep(2)
      }
    }
  }

  const handleBack = () => setActiveStep(prev => prev - 1)

  const getCurrentStepSchema = () => {
    switch (activeStep) {
      case 0:
        return step1PartialSchema
      case 1:
        return step2PartialSchema
      case 2:
        return step3Schema
      default:
        return step1PartialSchema
    }
  }

  const handleNext = async (formMethods: any) => {
    try {

      if (activeStep === 0) {
        const result = step1Schema.safeParse(formMethods.getValues())

        if (!result.success) {
          result.error.errors.forEach(error => {
            formMethods.setError(error.path[0], { message: error.message })
          })
          notify('Complete todos los campos requeridos del paso 1', 'error')

          return
        }

        setActiveStep(1)
      } else if (activeStep === 1) {
        return
      } else if (activeStep < steps.length - 1) {
        setActiveStep(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error validating step:', error)
      notify('Error al validar el formulario', 'error')
    }
  }

  const handleReset = () => setActiveStep(0)

  const getFormSchema = () => {
    if (propertyId) return editPropertySchema
    if (activeStep === 1) return createPropertySchema

    return getCurrentStepSchema()
  }

  const schema = getFormSchema()

  const handleSuccess = (property: CreatePropertyFormData | EditPropertyFormData) => {
    console.log(`Propiedad ${mode === 'edit' ? 'actualizada' : 'creada'}:`, property)

    if (mode === 'create' && activeStep === 1) {
      setActiveStep(2)
      notify('Propiedad creada exitosamente. Ahora puedes agregar características e imágenes.', 'success')
    } else {
      onSuccess?.(property)
    }
  }

  const handleError = (error: any) => {
    console.error('Error en el formulario:', error)
    console.error('Error response:', error.response)
    console.error('Error data:', error.response?.data)
    console.error('Error status:', error.response?.status)
    console.error('Error headers:', error.response?.headers)

    // Mostrar el error específico del backend
    if (error.response?.data) {
      const errorData = error.response.data
      console.error('Backend error details:', errorData)

      if (errorData.message) {
        notify(errorData.message, 'error')
      } else if (errorData.detail) {
        notify(errorData.detail, 'error')
      } else if (errorData.error) {
        notify(errorData.error, 'error')
      } else {
        notify(`Error ${error.response.status}: ${JSON.stringify(errorData)}`, 'error')
      }
    } else {
      notify('Error al procesar el formulario', 'error')
    }
  }

  const setFormData = (data: any, methods: any) => {
    const asyncFields = ['state_id', 'municipality_id', 'parish_id', 'owner_id', 'franchise_id', 'assigned_to_id']

    Object.entries(data).forEach(([key, value]) => {
      if (asyncFields.includes(key)) {
        methods.setValue(key, value.value)
      } else {
        methods.setValue(key, value)
      }
    })
  }
  // Función para transformar los datos antes de enviarlos al backend
  const transformFormData = (data: any) => {
    console.log('🔍 transformFormData ejecutándose con:', data)

    const transformedData = { ...data }

    // Transformar campos async-select de {label, value} a solo value
    const asyncFields = ['state_id', 'municipality_id', 'parish_id', 'owner_id', 'franchise_id', 'assigned_to_id']

    asyncFields.forEach(field => {
      if (transformedData[field] && typeof transformedData[field] === 'object' && 'value' in transformedData[field]) {
        console.log(`🔄 Transformando ${field}:`, transformedData[field], '→', transformedData[field].value)
        transformedData[field] = transformedData[field].value
      }
    })

    console.log('✅ Datos transformados:', transformedData)
    return transformedData
  }
  const ClientFieldWithCreateButton = () => {
    const { setValue } = useFormContext()

    useEffect(() => {
      if (newlyCreatedClient) {
        setValue('owner_id', newlyCreatedClient.id)
        setNewlyCreatedClient(null)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newlyCreatedClient, setValue])

    return (
      <Grid size={{ xs: 12, md: 6 }}>
        <Box className='flex items-end gap-2'>
          <Box className='flex-1'>
            <FormField
              type='async-select'
              name='owner_id'
              label='Cliente'
              required
              repository={ClientsRepository}
            />
          </Box>
          <Button
            variant='outlined'
            onClick={handleOpenClientModal}
            sx={{
              minWidth: 'auto',
              height: '56px',
              px: 2
            }}
          >
            <i className='tabler-plus text-[18px]' />
          </Button>
        </Box>
      </Grid>
    )
  }

  const FormNavigationButtons = () => {
    const formMethods = useFormContext()

    return (
        <Box display='flex' gap={2} justifyContent='space-between' mt={3}>
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
          type={activeStep === 1 ? 'submit' : 'button'}
          variant='contained'
          onClick={activeStep === 1 ? undefined : () => handleNext(formMethods)}
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
      </Box>
    )
  }

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return <Step1Content />
      case 1:
        return (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                type='async-select'
                name='franchise_id'
                label='Franquicia'
                required
                repository={FranchisesRepository}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                type='async-select'
                name='assigned_to_id'
                label='Usuario Asignado'
                required
                repository={UsersRepository}
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
            <NegotiationPriceFields />
            <ClientFieldWithCreateButton />
          </>
        )
      case 2:
        return (
          <>
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
                    <Box className='step-label'>
                      <CustomAvatar
                        variant='rounded'
                        skin={activeStep === index ? 'filled' : 'light'}
                        {...(activeStep >= index && { color: 'primary' })}
                        {...(activeStep === index && { className: 'shadow-primarySm' })}
                        size={38}
                      >
                        <i className={classnames(step.icon)} />
                      </CustomAvatar>
                      <Box>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.description}</Typography>
                      </Box>
                    </Box>
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
              <Box className='flex justify-end mt-4'>
                <Button variant='contained' onClick={handleReset}>
                  Reset
                </Button>
              </Box>
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
              transformData={transformFormData}
              actionsComponent={<FormNavigationButtons />}
            >
              <Grid container spacing={6}>
                {renderStepContent(activeStep)}
              </Grid>
            </Form>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isClientModalOpen}
        onClose={handleCloseClientModal}
        maxWidth='md'
        fullWidth
        PaperProps={{ sx: { minHeight: '600px' } }}
      >
        <DialogTitle>
          <Box className='flex justify-between items-center'>
            <Typography variant='h6'>Crear Nuevo Cliente</Typography>
            <IconButton onClick={handleCloseClientModal} size='small'>
              <i className='tabler-x' />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isClientModalOpen && (
            <Box>
              {!users || !franchises || !clientStatuses ? (
                <Box className='flex justify-center p-5'>
                  <Typography>Cargando datos...</Typography>
                </Box>
              ) : (
                <ClientForm
                  statuses={clientStatuses}
                  users={users}
                  franchises={franchises}
                  onSuccess={handleClientCreated}
                />
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PropertyForm
