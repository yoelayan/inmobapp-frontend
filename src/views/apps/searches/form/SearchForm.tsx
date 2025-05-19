'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import {
  Button,
  Box,
  CircularProgress,
  Grid2 as Grid,
  Modal,
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
  MenuItem
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// Component Imports
import TextField from '@/components/form/TextField'
import SelectFieldAsync from '@/components/form/SelectFieldAsync'

// Hook Imports
import { useSearchForm } from './hooks/useSearchForm'
import { useNotification } from '@/hooks/useNotification'
import useClients from '@/hooks/api/crm/useClients'

// Type Imports
import type { ResponseAPI } from '@/api/repositories/BaseRepository'
import type { ISearch, IClient } from '@/types/apps/ClientesTypes'

// Components Imports
import { ClientForm } from '@/views/apps/clients/form/ClientForm'

// Component Props
interface SearchFormProps {
  searchId?: string
  onSuccess?: (response: ISearch) => void
  clients?: ResponseAPI<IClient> | null
  statuses?: ResponseAPI<any> | null
  users?: ResponseAPI<any> | null
  franchises?: ResponseAPI<any> | null
  refreshClients?: (filters?: Record<string, any>) => Promise<void>
}

export const SearchForm: React.FC<SearchFormProps> = ({
  searchId,
  onSuccess,
  clients,
  statuses,
  users,
  franchises,
  refreshClients
}) => {
  const { control, handleSubmit, errors, isSubmitting, isLoading, serverError, setValue, watch } = useSearchForm(
    searchId,
    onSuccess
  )

  const { notify } = useNotification()
  const [open, setOpen] = useState(false)

  // Initialize useClients hook if not provided
  const clientsHook = useClients()
  const effectiveClients = clients || clientsHook.data

  // Function to refresh client data if not provided externally
  const handleRefreshClients = async (filters?: Record<string, any>) => {
    if (refreshClients) {
      await refreshClients(filters)
    } else {
      await clientsHook.refreshData(filters)
    }
  }

  useEffect(() => {
    if (!clients) {
      clientsHook.fetchData()
    }
  }, [clients, clientsHook.fetchData, clientsHook])

  const handleButtonModal = () => {
    setOpen(!open)
  }

  const ModalClient = () => {
    const handleSuccess = (response: IClient) => {
      setValue('client_id', response.id)
      handleRefreshClients()
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

  // Conditional Rendering (Loading/Initial Error)
  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Cargando datos de la búsqueda...</span>
      </Box>
    )
  }

  // Show general error if it occurred during initial loading or submission
  // and is not associated with a specific field.
  if (serverError && !isLoading && !isSubmitting) {
    notify(serverError, 'error')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            control={control}
            error={errors.description}
            name='description'
            label='Descripción'
            setValue={setValue}
            value={watch('description')}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            control={control}
            error={errors.budget}
            name='budget'
            label='Presupuesto'
            setValue={setValue}
            value={watch('budget')}
          />
        </Grid>

        <ModalClient />

        <Grid size={{ xs: 12 }}>
          <SelectFieldAsync
            name='client_id'
            label='Cliente'
            control={control}
            error={errors.client_id}
            setValue={setValue}
            value={watch('client_id')}
            response={effectiveClients}
            dataMap={{ value: 'id', label: 'name' }}
            refreshData={handleRefreshClients}
          >
            <MenuItem onClick={handleButtonModal}>
              <i className='tabler-user-plus' /> Crear un nuevo cliente
            </MenuItem>
            <Divider />
          </SelectFieldAsync>
        </Grid>

        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%'
          }}
        >
          <Button variant='contained' color='primary' type='submit' disabled={isSubmitting} sx={{ mt: 2 }}>
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color='inherit' sx={{ mr: 1 }} />
                Guardando...
              </>
            ) : searchId ? (
              'Actualizar Búsqueda'
            ) : (
              'Crear Búsqueda'
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
