// forms/UserForm.tsx
import React from 'react'

import { useQuery } from '@tanstack/react-query'

import {
  Grid2, Alert
} from '@mui/material'



import { Form, FormField, PageContainer } from '@components/common/forms/Form'
import { PermissionsField } from './components/UserPermissionsField'

import UsersRepository from '@services/repositories/users/UsersRepository'

import { userSchema, editUserSchema, type CreateUserFormData, type EditUserFormData } from '@/validations/userSchema'

import { useAuth } from '@auth/hooks/useAuth'

import useFranchises from '@hooks/api/realstate/useFranchises'


interface UserFormProps {
  mode?: 'create' | 'edit'
  userId?: number
  onSuccess?: (user: CreateUserFormData | EditUserFormData) => void
}

const UserForm = ({ mode = 'create', userId, onSuccess }: UserFormProps) => {


  const { user: currentUser } = useAuth()
  const { fetchData: fetchFranchises } = useFranchises()

  const franchises = useQuery({
    queryKey: ['franchises'],
    queryFn: () => fetchFranchises(),
  })

  // Check if the user being edited is the same as the logged-in user
  const isEditingCurrentUser = mode === 'edit' && currentUser && userId === currentUser.id

  const handleSuccess = (userData: CreateUserFormData | EditUserFormData) => {
    console.log(`Usuario ${mode === 'edit' ? 'actualizado' : 'creado'}:`, userData)
    onSuccess?.(userData)
  }

  const handleError = (error: any) => {
    console.error('Error en el formulario:', error)
  }

  // Custom function to set form data from backend, excluding image URL
  const setFormData = (data: any, methods: any) => {
    Object.entries(data).forEach(([key, value]) => {
      // Skip setting image field if it's a URL from backend
      if (key === 'image' && typeof value === 'string') {
        return
      }

      if (key === 'user_permissions' && Array.isArray(value)) {
        // Extract codename values from backend permission objects
        const rawPermissions = value.map((permission: any) => permission.codename)

        // Value must be an array of codenames -> ['add_user', 'change_user', 'delete_user', 'view_user']
        methods.setValue(key, rawPermissions)
      } else {
        methods.setValue(key, value)
      }
    })
  }

  // Get current image URL from backend data for display purposes
  const [currentImageUrl, setCurrentImageUrl] = React.useState<string | undefined>()

  const handleSetFormData = (data: any, methods: any) => {
    // Store the current image URL for display
    if (data.image && typeof data.image === 'string') {
      setCurrentImageUrl(data.image)
    }

    setFormData(data, methods)
  }

  // Default values for create mode
  const defaultValues: Partial<CreateUserFormData> = {
    name: '',
    password: '',
    confirmPassword: '',
    image: null,
    email: '',
    franchise_id: franchises?.data?.results?.find(franchise => franchise.franchise_type === 'COMMERCIAL')?.id,
    user_permissions: [] as string[]
  }

  // Use appropriate schema based on mode
  const schema = mode === 'edit' ? editUserSchema : userSchema

  return (
    <PageContainer
      title={mode === 'edit' ? 'Editar Usuario' : 'Crear Usuario'}
      subtitle={mode === 'edit' ? 'Modifica los datos del usuario' : 'Completa todos los campos requeridos'}
    >
      <Form
        schema={schema}
        defaultValues={defaultValues}
        repository={UsersRepository}
        mode={mode}
        entityId={userId}
        onSuccess={handleSuccess}
        onError={handleError}
        setFormData={handleSetFormData}
      >
        <Grid2 container spacing={4}>
          {/* Columna izquierda: nombre, email, contraseñas */}
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <FormField name='name' label='Nombre Completo' required fullWidth />
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <FormField name='email' type='email' label='Correo Electrónico' required fullWidth />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormField name='password' type='password' label='Contraseña' required={mode === 'create'} fullWidth />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormField
                  name='confirmPassword'
                  type='password'
                  label='Confirmar Contraseña'
                  required={mode === 'create'}
                  fullWidth
                />
              </Grid2>
            </Grid2>
          </Grid2>

          {/* Sidebar derecha: alerta, imagen, franquicia */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormField
              name='franchise_id'
              type='select'
              label='Franquicia'
              options={
                franchises?.data?.results?.map(franchise => ({
                  value: franchise.id,
                  label: franchise.name
                })) || []
              }
              required
              fullWidth
            />
            <FormField name='image' type='image' label='Imagen' required fullWidth currentImageUrl={currentImageUrl} />
          </Grid2>
        </Grid2>
        {/* Permisos */}
        <Grid2 size={{ xs: 12 }} sx={{ mt: 4 }}>
          <PermissionsField
            name='user_permissions'
            label='Permisos de Usuario'
            showGroups
            showSearch
            showFilters
            collapsible
          />
        </Grid2>

        {isEditingCurrentUser && (
          <Alert severity='warning' sx={{ mb: 3 }}>
            <strong>Advertencia:</strong> Estás editando tu propio perfil. Si realizas cambios, serás deslogueado
            automáticamente.
          </Alert>
        )}
      </Form>
    </PageContainer>
  )
}

export default UserForm
