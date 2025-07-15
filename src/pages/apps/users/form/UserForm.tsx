'use client'

import React from 'react'

import {
  Box, CircularProgress, Grid2 as Grid, Typography, Card, CardHeader, CardContent,
  Accordion, AccordionSummary, AccordionDetails,
  Divider,
  Button,
  CardActions,
  TextField,
  Select,
  Checkbox
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { useNotification } from '@/hooks/useNotification'

import type { IUser, IUserPermission, IUserGroup } from '@/types/apps/UserTypes'
import type { IUserFormData } from '@/types/apps/UserTypes'

// Definición de grupos de permisos

interface PermissionGroup {
  codename: string
  name: string
  permissions: IUserPermission[]
}

interface UserFormProps {
  userId?: string
  onSuccess?: (response: IUser) => void
}

export const UserForm: React.FC<UserFormProps> = ({ userId, onSuccess }) => {


  const { notify } = useNotification()
  const isLoading = false
  const isSubmitting = false
  const serverError = null
  const watch = () => { }

  const control = {
    _formValues: {}
  }

  // Definición de grupos de permisos
  const permissionGroups: PermissionGroup[] = [
    {
      codename: 'propiedades',
      name: 'Propiedades',
      permissions: [
        { codename: 'properties_view', name: 'Ver propiedades', description: 'Permite ver la lista de propiedades' },
        { codename: 'properties_create', name: 'Crear propiedades', description: 'Permite crear nuevas propiedades' },
        { codename: 'properties_edit', name: 'Editar propiedades', description: 'Permite modificar propiedades existentes' },
        { codename: 'properties_delete', name: 'Eliminar propiedades', description: 'Permite eliminar propiedades' }
      ]
    },
    {
      codename: 'clientes',
      name: 'Clientes',
      permissions: [
        { codename: 'clients_view', name: 'Ver clientes', description: 'Permite ver la lista de clientes' },
        { codename: 'clients_create', name: 'Crear clientes', description: 'Permite crear nuevos clientes' },
        { codename: 'clients_edit', name: 'Editar clientes', description: 'Permite modificar clientes existentes' },
        { codename: 'clients_delete', name: 'Eliminar clientes', description: 'Permite eliminar clientes' }
      ]
    },
    {
      codename: 'franquicias',
      name: 'Franquicias',
      permissions: [
        { codename: 'franchises_view', name: 'Ver franquicias', description: 'Permite ver la lista de franquicias' },
        { codename: 'franchises_create', name: 'Crear franquicias', description: 'Permite crear nuevas franquicias' },
        { codename: 'franchises_edit', name: 'Editar franquicias', description: 'Permite modificar franquicias existentes' },
        { codename: 'franchises_delete', name: 'Eliminar franquicias', description: 'Permite eliminar franquicias' }
      ]
    },
    {
      codename: 'usuarios',
      name: 'Usuarios',
      permissions: [
        { codename: 'users_view', name: 'Ver usuarios', description: 'Permite ver la lista de usuarios' },
        { codename: 'users_create', name: 'Crear usuarios', description: 'Permite crear nuevos usuarios' },
        { codename: 'users_edit', name: 'Editar usuarios', description: 'Permite modificar usuarios existentes' },
        { codename: 'users_delete', name: 'Eliminar usuarios', description: 'Permite eliminar usuarios' }
      ]
    },
    {
      codename: 'administracion',
      name: 'Administración',
      permissions: [
        { codename: 'admin_settings', name: 'Configuración', description: 'Permite acceder a la configuración del sistema' },
        { codename: 'admin_reports', name: 'Reportes', description: 'Permite generar y ver reportes' },
        { codename: 'admin_backup', name: 'Respaldos', description: 'Permite crear y restaurar respaldos' },
        { codename: 'admin_logs', name: 'Logs del sistema', description: 'Permite ver los logs del sistema' }
      ]
    }
  ]

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Cargando datos del usuario...</span>
      </Box>
    )
  }

  if (serverError && !isLoading && !isSubmitting) {
    notify(serverError, 'error')
  }

  // Mock data for watch values - replace with actual form values

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Card>
        <CardHeader title={userId ? 'Editar Usuario' : 'Crear Usuario'} />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                label='Nombre'
                name='name'
              />
            </Grid>
            <Grid size={12}>
              <TextField label='Email' name='email' />
            </Grid>
            <Grid size={6}>
              <TextField label='Contraseña' name='password' />
            </Grid>
            <Grid size={6}>
              <TextField label='Repetir Contraseña' name='password_confirm' />
            </Grid>
            <Grid size={6}>
              <Select label='Franquicia' name='franchise' />
            </Grid>
            <Grid size={6}>
              <Select label='Rol' name='role' multiple />
            </Grid>

            {/* Sección de Permisos */}
            <Grid size={12}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Permisos
              </Typography>

              {permissionGroups.map(group => (
                <Accordion key={group.codename} sx={{ mb: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${group.codename}-content`}
                    id={`${group.codename}-header`}
                  >
                    <Typography variant='subtitle1' fontWeight='medium'>
                      {group.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {group.permissions.map(permission => (
                        <Grid size={6} key={permission.codename}>
                          <Checkbox
                            label={permission.name}
                            name={`permissions.${permission.codename}`}
                          />
                          <Typography variant='caption' color='text.secondary' display='block'>
                            {permission.description}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions className='flex justify-end'>
          <Button variant='contained' type='submit'>
            Guardar
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
