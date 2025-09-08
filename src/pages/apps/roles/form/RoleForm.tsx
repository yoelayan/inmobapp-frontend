import React from 'react'

import {
  Grid2,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography
} from '@mui/material'

import {
  Security as SecurityIcon,
  Group as GroupIcon
} from '@mui/icons-material'

import { Form, FormField, PageContainer } from '@components/common/forms/Form'
import PermissionsField from '@/components/forms/PermissionsField'

import RolesRepository from '@services/repositories/roles/RolesRepository'

import {
  createRoleSchema,
  editRoleSchema,
  defaultRoleValues,
  type CreateRoleFormData,
  type EditRoleFormData
} from '@/validations/roleSchema'

interface RoleFormProps {
  mode?: 'create' | 'edit'
  roleId?: number
  onSuccess?: (role: CreateRoleFormData | EditRoleFormData) => void
}

const RoleForm = ({ mode = 'create', roleId, onSuccess }: RoleFormProps) => {
  const handleSuccess = (roleData: CreateRoleFormData | EditRoleFormData) => {
    console.log(`Rol ${mode === 'edit' ? 'actualizado' : 'creado'}:`, roleData)
    onSuccess?.(roleData)
  }

  const handleError = (error: any) => {
    console.error('Error en el formulario de rol:', error)
  }

  // Custom function to set form data from backend
  const setFormData = (data: any, methods: any) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'permissions' && Array.isArray(value)) {
        // Extract codename values from backend permission objects
        const rawPermissions = value.map((permission: any) => permission.codename)

        methods.setValue(key, rawPermissions)
      } else {
        methods.setValue(key, value)
      }
    })
  }

  // Use appropriate schema based on mode
  const schema = mode === 'edit' ? editRoleSchema : createRoleSchema

  return (
    <PageContainer
      title={mode === 'edit' ? 'Editar Rol' : 'Crear Rol'}
      subtitle={mode === 'edit' ? 'Modifica los datos del rol' : 'Completa todos los campos requeridos'}
    >
      <Form
        schema={schema}
        defaultValues={defaultRoleValues}
        repository={RolesRepository}
        mode={mode}
        entityId={roleId}
        onSuccess={handleSuccess}
        onError={handleError}
        setFormData={setFormData}
      >
        <Grid2 container spacing={4}>
          {/* Información básica del rol */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <GroupIcon color="primary" />
                    <Typography variant="h6">
                      Información del Rol
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12 }}>
                    <FormField
                      name='name'
                      label='Nombre del Rol'
                      required
                      fullWidth
                      placeholder="Ej: Editor, Administrador, Supervisor..."
                      helperText="El nombre debe ser descriptivo y único"
                    />
                  </Grid2>
                </Grid2>
              </CardContent>
            </Card>
          </Grid2>

          {/* Información adicional o estadísticas */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <SecurityIcon color="primary" />
                    <Typography variant="h6">
                      Información del Sistema
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Importante:</strong> Los roles definen qué acciones pueden realizar los usuarios en el sistema.
                  </Typography>
                </Alert>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Los permisos son acumulativos: un usuario puede tener múltiples roles
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Asegúrate de asignar solo los permisos necesarios
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Los cambios se aplicarán inmediatamente a todos los usuarios con este rol
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        {/* Permisos del rol */}
        <Grid2 size={{ xs: 12 }} sx={{ mt: 4 }}>
          <PermissionsField
            name='permissions'
            label='Permisos del Rol'
            showGroups
            showSearch
            showFilters
            collapsible
          />
        </Grid2>

        {/* Advertencia para edición */}
        {mode === 'edit' && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Advertencia:</strong> Los cambios en este rol afectarán inmediatamente a todos los usuarios que lo tengan asignado.
            </Typography>
          </Alert>
        )}
      </Form>
    </PageContainer>
  )
}

export default RoleForm
