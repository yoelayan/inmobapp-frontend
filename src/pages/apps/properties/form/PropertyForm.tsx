import { useEffect, useState, useCallback } from 'react'

import { useQuery } from '@tanstack/react-query'

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

import useStates from '@hooks/api/locations/useStates'
import useMunicipalities from '@hooks/api/locations/useMunicipalities'
import useParishes from '@hooks/api/locations/useParishes'

import usePropertyNegotiation from '@hooks/api/realstate/usePropertyNegotiation'

import useClients from '@hooks/api/crm/useClients'
import useClientStatus from '@hooks/api/crm/useClientStatus'
import useUsers from '@hooks/api/users/useUsers'
import useFranchises from '@hooks/api/realstate/useFranchises'

import { Form, FormField } from '@components/common/forms/Form'
import {type AsyncSelectOption } from '@components/common/forms/fields/AsyncSelectField'
import { ClientForm } from '@/pages/apps/clients/form/ClientForm'
import CustomAvatar from '@core/components/mui/Avatar'
import DirectionalIcon from '@components/DirectionalIcon'
import StepperWrapper from '@core/styles/stepper'

import PropertiesRepository from '@services/repositories/realstate/PropertiesRepository'
import UsersRepository from '@services/repositories/users/UsersRepository'
import { useNotification } from '@hooks/useNotification'

import {
  createPropertySchema,
  editPropertySchema,
  defaultPropertyValues,
  step1Schema,
  step2Schema,
  step3Schema,
  step1PartialSchema,
  step2PartialSchema,
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
  const [selectedState, setSelectedState] = useState<number | null>(null)
  const [selectedMunicipality, setSelectedMunicipality] = useState<number | null>(null)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [newlyCreatedClient, setNewlyCreatedClient] = useState<any>(null)
  const isSmallScreen = useMediaQuery('(max-width: 600px)')

  // Funciones de búsqueda asíncrona para los AsyncSelectField


  const searchUsers = useCallback(async (searchTerm: string): Promise<AsyncSelectOption[]> => {
    try {
      // Si no hay término de búsqueda, devolver todos los usuarios
      const params = searchTerm ? { search: searchTerm, per_page: 50 } : { per_page: 50 }
      const response = await UsersRepository.getAll(params)

      return response.results?.map(user => ({
        value: user.id,
        label: user.name
      })) || []
    } catch (error) {
      console.error('Error searching users:', error)

      return []
    }
  }, [])

  // Funciones para el modal de crear cliente
  const handleOpenClientModal = () => {
    // Asegurar que los datos estén cargados antes de abrir el modal
    if (!users || !franchises || !clientStatuses) {
      fetchUsers()
      fetchFranchises()
      fetchClientStatuses()
    }

    setIsClientModalOpen(true)
  }

  const handleCloseClientModal = () => {
    setIsClientModalOpen(false)
  }

  const handleClientCreated = (newClient: any) => {
    // Cerrar el modal
    setIsClientModalOpen(false)

    // Refrescar la lista de clientes
    fetchClients()

    // Guardar el cliente recién creado para seleccionarlo automáticamente
    setNewlyCreatedClient(newClient)

    notify(`Cliente "${newClient.name}" creado exitosamente`, 'success')
  }

  /* Data */

  const { loading: statusesLoading, data: statuses, fetchData: fetchStatuses } = usePropertyStatus()
  const { loading: negotiationsLoading, data: negotiations, fetchData: fetchNegotiations } = usePropertyNegotiation()
  const { loading: propertyTypesLoading, data: propertyTypes, fetchData: fetchPropertyTypes } = usePropertyTypes()
  const { loading: clientsLoading, data: clients, fetchData: fetchClients } = useClients()
  const { loading: clientStatusLoading, data: clientStatuses, fetchData: fetchClientStatuses } = useClientStatus()
  const { loading: usersLoading, data: users, fetchData: fetchUsers } = useUsers()
  const { loading: franchisesLoading, data: franchises, fetchData: fetchFranchises } = useFranchises()


  const { loading: statesLoading, data: states, fetchData: fetchStates } = useStates()
  const { loading: municipalitiesLoading, data: municipalities, fetchData: fetchMunicipalities } = useMunicipalities()
  const { loading: parishesLoading, data: parishes, fetchData: fetchParishes } = useParishes()



  // Componente para manejar los campos de precio según el tipo de negociación
  const NegotiationPriceFields = () => {
    const { watch, setValue } = useFormContext()
    const negotiationTypeId = watch('type_negotiation_id')

    // Determinar qué campos mostrar según el tipo de negociación
    const showSalePrice = negotiationTypeId === 1 || negotiationTypeId === 3 // Venta o Venta y Alquiler
    const showRentPrice = negotiationTypeId === 2 || negotiationTypeId === 3 // Alquiler o Venta y Alquiler

    // Limpiar campos de precio cuando cambia el tipo de negociación
    useEffect(() => {
      if (negotiationTypeId) {
        // Si no debe mostrar precio de venta, limpiarlo
        if (!showSalePrice) {
          setValue('price', '')
        }
        // Si no debe mostrar precio de alquiler, limpiarlo
        if (!showRentPrice) {
          setValue('rent_price', '')
        }
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
              required={negotiationTypeId === 1} // Requerido solo para "Venta"
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
              required={negotiationTypeId === 2} // Requerido solo para "Alquiler"
              fullWidth
            />
          </Grid>
        )}
        {!negotiationTypeId && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', p: 2 }}>
              Selecciona un tipo de negociación para configurar los precios
            </Typography>
          </Grid>
        )}
      </>
    )
  }

  // Componente interno para el paso 1 que puede usar useFormContext
  const Step1Content = () => {
    const { watch, setValue } = useFormContext()
    const stateId = watch('state_id')
    const municipalityId = watch('municipality_id')

    // Escuchar cambios en state_id
    useEffect(() => {
      if (stateId && stateId !== selectedState) {
        setSelectedState(Number(stateId))
        // Reset municipality and parish when state changes
        setSelectedMunicipality(null)
        setValue('municipality_id', '')
        setValue('parish_id', '')
      }
    }, [stateId, setValue])

    // Escuchar cambios en municipality_id
    useEffect(() => {
      if (municipalityId && municipalityId !== selectedMunicipality) {
        setSelectedMunicipality(Number(municipalityId))
        // Reset parish when municipality changes
        setValue('parish_id', '')
      }
    }, [municipalityId, setValue])

    return (
      <>
        {/* Información General */}
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
            options={
              statuses?.results?.map(status => ({
                value: status.id,
                label: status.name
              })) || []
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
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
            type='async-select'
            name='state_id'
            label='Estado'
            required
            fullWidth
            loading={statesLoading}
            loadOptions={fetchStates}
            options={states?.results?.map(state => ({
              value: state.id,
              label: state.name
            })) || []}
            placeholder='Seleccionar estado...'
            minSearchLength={0}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          {/* <FormField
            type='async-select'
            name='municipality_id'
            label='Municipio'
            required
            fullWidth
            disabled={!selectedState}
            loadOptions={searchMunicipalities}
            placeholder='Seleccionar municipio...'
            minSearchLength={0}
            noOptionsText={!selectedState ? 'Selecciona un estado primero' : 'No se encontraron municipios'}
          /> */}
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          {/* <FormField
            type='async-select'
            name='parish_id'
            label='Parroquia'
            required
            fullWidth
            disabled={!selectedMunicipality}
            loadOptions={searchParishes}
            placeholder='Seleccionar parroquia...'
            minSearchLength={0}
            noOptionsText={!selectedMunicipality ? 'Selecciona un municipio primero' : 'No se encontraron parroquias'}
          /> */}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormField name='code' label='Código' fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormField name='address' label='Dirección' required fullWidth />
        </Grid>
      </>
    )
  }

  useEffect(() => {
    fetchStatuses()
    fetchNegotiations()
    fetchPropertyTypes()
    fetchClients()
    fetchClientStatuses()
    fetchUsers()
    fetchFranchises()
  }, [
    fetchStatuses,
    fetchNegotiations,
    fetchPropertyTypes,
    fetchClients,
    fetchClientStatuses,
    fetchUsers,
    fetchFranchises
  ])

  /* Steps Control */

  const handleStep = (index: number) => {
    if (propertyId) {
      // En modo edición, permite navegar libremente
      setActiveStep(index)
    } else {
      // En modo creación, controlar acceso por pasos
      if (index === 0) {
        // Siempre permitir ir al paso 1
        setActiveStep(0)
      } else if (index === 1) {
        // Solo permitir paso 2 si el paso 1 está completo
        notify('Complete el paso 1 primero', 'warning')
      } else if (index === 2) {
        // Solo permitir paso 3 si la propiedad ya está creada
        if (!propertyId) {
          notify('Debe crear la propiedad en el paso 2 antes de continuar', 'warning')
        } else {
          setActiveStep(2)
        }
      }
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const getCurrentStepSchema = () => {
    switch (activeStep) {
      case 0:
        return step1PartialSchema // Validación parcial para mostrar errores sin bloquear
      case 1:
        return step2PartialSchema // Validación parcial para mostrar errores sin bloquear
      case 2:
        return step3Schema
      default:
        return step1PartialSchema
    }
  }

  const handleNext = async (formMethods: any) => {
    try {
      // Validar el paso actual antes de avanzar
      if (activeStep === 0) {
        // Validar paso 1 completamente antes de avanzar
        const result = step1Schema.safeParse(formMethods.getValues())
        if (!result.success) {
          // Mostrar errores específicos del paso 1
          result.error.errors.forEach(error => {
            formMethods.setError(error.path[0], { message: error.message })
          })
          notify('Complete todos los campos requeridos del paso 1', 'error')
          return
        }
        // Si la validación es exitosa, avanzar al paso 2
        setActiveStep(1)
      } else if (activeStep === 1) {
        // Para el paso 2, el botón será de tipo submit para crear la propiedad
        // La validación se maneja en el formulario
        return
      } else if (activeStep < steps.length - 1) {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
      }
    } catch (error) {
      console.error('Error validating step:', error)
      notify('Error al validar el formulario', 'error')
    }
  }

  const getFormData = () => {
    // Esta función ya no es necesaria
    return {}
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  // El esquema cambia según el paso activo y si estamos creando/editando
  const getFormSchema = () => {
    if (propertyId) {
      return editPropertySchema
    }

    // Para creación, usar esquema de creación solo en paso 2 (cuando se crea la propiedad)
    if (activeStep === 1) {
      return createPropertySchema
    }

    // Para otros pasos, usar esquemas parciales
    return getCurrentStepSchema()
  }

  const schema = getFormSchema()

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

  // Componente para el campo cliente con botón crear
  const ClientFieldWithCreateButton = () => {
    const { setValue } = useFormContext()

    // Efecto para seleccionar automáticamente el cliente recién creado
    useEffect(() => {
      if (newlyCreatedClient) {
        setValue('owner_id', newlyCreatedClient.id)
        // Limpiar el estado después de seleccionar
        setNewlyCreatedClient(null)
      }
    }, [newlyCreatedClient, setValue])

    return (
      <Grid size={{ xs: 12, md: 6 }}>
        <Box className="flex items-end gap-2">
          <Box className="flex-1">
            {/* <FormField
              type='async-select'
              name='owner_id'
              label='Cliente'
              required
              fullWidth
              loadOptions={searchClients}
              placeholder='Buscar cliente...'
              minSearchLength={0}
            /> */}
          </Box>
          <Button
            variant='outlined'
            onClick={handleOpenClientModal}
            sx={{
              minWidth: 'auto',
              height: '56px', // Matching the height of the AsyncSelectField
              px: 2
            }}
          >
            <i className="tabler-plus text-[18px]" />
          </Button>
        </Box>
      </Grid>
    )
  }

  // Componente para los botones de navegación con acceso a métodos del formulario
  const FormNavigationButtons = () => {
    const formMethods = useFormContext()

    return (
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
      </Grid>
    )
  }

  const renderStepContent = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return <Step1Content />
      case 1:
        return (
          <>
            {/* Datos de Negociacion */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* <FormField
                type='async-select'
                name='franchise_id'
                label='Franquicia'
                required
                fullWidth
                loadOptions={searchFranchises}
                placeholder='Buscar franquicia...'
                minSearchLength={0}
              /> */}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {/* <FormField
                type='async-select'
                name='assigned_to_id'
                label='Usuario Asignado'
                required
                fullWidth
                loadOptions={searchUsers}
                placeholder='Buscar usuario...'
                minSearchLength={0}
              /> */}
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
            >
              <Grid container spacing={6}>
                {renderStepContent(activeStep)}
                <FormNavigationButtons />
              </Grid>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* Modal para crear cliente */}
      <Dialog
        open={isClientModalOpen}
        onClose={handleCloseClientModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '600px' }
        }}
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">Crear Nuevo Cliente</Typography>
            <IconButton onClick={handleCloseClientModal} size="small">
              <i className="tabler-x" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isClientModalOpen && (
            <Box>
              {!users || !franchises || !clientStatuses ? (
                <Box className="flex justify-center p-5">
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
