// forms/UserForm.tsx
import React, { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useFormContext, useWatch } from 'react-hook-form'

import {
  Grid2, Alert
} from '@mui/material'



import { Form, FormField, PageContainer } from '@components/common/forms/Form'
import PermissionsField from '@/components/forms/PermissionsField'

import UsersRepository from '@services/repositories/users/UsersRepository'

import { userSchema, editUserSchema, type CreateUserFormData, type EditUserFormData } from '@/validations/userSchema'

import { useAuth } from '@auth/hooks/useAuth'

import useFranchises from '@hooks/api/realstate/useFranchises'
import useRoles from '@hooks/api/roles/useRoles'


interface UserFormProps {
  mode?: 'create' | 'edit'
  userId?: number
  onSuccess?: (user: CreateUserFormData | EditUserFormData) => void
}


const PermissionsSync = () => {
  const selectedGroups = useWatch({ name: 'groups' }) as number[] || []
  const { setValue, getValues } = useFormContext<CreateUserFormData | EditUserFormData>()

  const { fetchData: fetchRoles } = useRoles()

  const groups = useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchRoles(),
  })

  useEffect(() => {
    if (!groups?.data?.results || !selectedGroups.length) {
      return
    }

    console.log('PermissionsSync - Roles changed:', selectedGroups)

    // Obtener permisos de los roles seleccionados
    const rolePermissions = new Set<string>()

    selectedGroups.forEach(groupId => {
      const group = groups.data.results.find(g => g.id === groupId)

      if (group?.permissions) {
        group.permissions.forEach(permission => {
          rolePermissions.add(permission.codename)
        })
      }
    })

    // Obtener permisos actuales del formulario
    const currentPermissions = getValues('user_permissions') as string[] || []

    // Obtener permisos directos (que no vienen de roles)
    const allRolePermissions = Array.from(rolePermissions)
    const directPermissions = currentPermissions.filter(perm => !allRolePermissions.includes(perm))

    // Combinar permisos directos con permisos de roles
    const newPermissions = [...directPermissions, ...allRolePermissions]

    console.log('PermissionsSync - Final permissions:', newPermissions)

    // Actualizar el campo de permisos
    setValue('user_permissions', newPermissions)
  }, [selectedGroups, groups?.data?.results, setValue, getValues])

  return null
}

const UserForm = ({ mode = 'create', userId, onSuccess }: UserFormProps) => {


  const { user: currentUser, logout } = useAuth()
  const { fetchData: fetchFranchises } = useFranchises()
  const { fetchData: fetchRoles } = useRoles()

  const franchises = useQuery({
    queryKey: ['franchises'],
    queryFn: () => fetchFranchises(),
  })

  const groups = useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchRoles(), // console.log para hacer el match de los permisos de los usuarios, debe hacer el selected mas no agregar nuevos.
  })

  // Check if the user being edited is the same as the logged-in user
  const isEditingCurrentUser = mode === 'edit' && currentUser && userId === currentUser.id

  const handleSuccess = (userData: CreateUserFormData | EditUserFormData) => {
    console.log(`Usuario ${mode === 'edit' ? 'actualizado' : 'creado'}:`, userData)

    if (isEditingCurrentUser) {
      logout()
    }

    onSuccess?.(userData)
  }

  const handleError = (error: any) => {
    console.error('Error en el formulario:', error)
  }

  // Custom function to set form data from backend, excluding image URL
  const setFormData = (data: any, methods: any) => {
    console.log('=== setFormData called ===')
    console.log('Backend data received:', data)

    // Variables para almacenar los permisos y roles
    let userPermissions: string[] = []
    let groupIds: number[] = []

    Object.entries(data).forEach(([key, value]) => {
      // For image field, store the URL but don't set it in the form
      if (key === 'image' && typeof value === 'string') {
        // Store the current image URL for display purposes
        setCurrentImageUrl(value)

        // Don't set the image field in the form to avoid conflicts
        return
      }

      if (key === 'user_permissions' && Array.isArray(value)) {
        // Los user_permissions ya vienen como array de strings (codenames)
        console.log('Raw user_permissions from backend:', value)
        userPermissions = value // Ya son strings, no necesitamos mapear
        console.log('Setting user_permissions:', userPermissions)
        methods.setValue(key, userPermissions)
      } else if (key === 'groups' && Array.isArray(value)) {
        // Extract group IDs from backend group objects
        groupIds = value.map((group: any) => group.id)
        console.log('Setting groups:', groupIds)
        methods.setValue(key, groupIds)
      } else {
        methods.setValue(key, value)
      }
    })

    // Sincronizar permisos cuando se cargan los roles (después de procesar todos los datos)
    if (groups?.data?.results && groupIds.length > 0) {
      console.log('Selected group IDs from backend:', groupIds)

      // Obtener permisos de los roles seleccionados
      const rolePermissions = new Set<string>()

      groupIds.forEach(groupId => {
        const group = groups.data.results.find(g => g.id === groupId)

        if (group?.permissions) {
          console.log(`Group ${groupId} permissions:`, group.permissions)
          group.permissions.forEach(permission => {
            rolePermissions.add(permission.codename)
          })
        }
      })

      // Obtener permisos directos del usuario (que no vienen de roles)
      const allRolePermissions = Array.from(rolePermissions)
      const directPermissions = userPermissions.filter(perm => !allRolePermissions.includes(perm))

      // Combinar permisos directos con permisos de roles
      const newPermissions = [...directPermissions, ...allRolePermissions]

      console.log('Final synchronized permissions:', newPermissions)

      // Actualizar el campo de permisos
      methods.setValue('user_permissions', newPermissions)
    }
  }

  // Function to format data before submission, handling image field properly
  const formatData = (data: CreateUserFormData | EditUserFormData) => {
    const formattedData = { ...data }

    // Only send image field if it's a File (new image selected)
    if (formattedData.image instanceof File) {
      console.log('New image selected, sending File object')
    } else {
      // For all other cases (undefined, null, string), don't send the field
      delete formattedData.image
      console.log('Image field not a File, removing from submission to preserve existing image')
    }

    console.log('Final formatted data:', formattedData)

    return formattedData
  }

  // Get current image URL from backend data for display purposes
  const [currentImageUrl, setCurrentImageUrl] = React.useState<string | undefined>()

  // Removed unused handleSetFormData function

  // Default values for create mode
  const defaultValues: Partial<CreateUserFormData> = {
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    franchise_id: franchises?.data?.results?.find(franchise => franchise.franchise_type === 'COMMERCIAL')?.id,
    groups: [] as number[],
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
        setFormData={setFormData}
        formatData={formatData}
      >
        <PermissionsSync />
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
            <FormField
              name='groups'
              type='select'
              multiple
              label='Roles'
              placeholder='Selecciona roles...'
              options={
                groups?.data?.results?.map(group => ({
                  value: group.id,
                  label: group.name
                })) || []
              }
              fullWidth
              helperText='Selecciona uno o más roles para el usuario'
              SelectProps={{
                multiple: true,
                renderValue: (selected: any) => {
                  if (!selected || selected.length === 0) {
                    return 'Selecciona roles...'
                  }

                  const selectedGroups = groups?.data?.results?.filter(group => selected.includes(group.id)) || []

                  return selectedGroups.map(group => group.name).join(', ')
                }
              }}
            />
                        <FormField
              name='image'
              type='image'
              label='Imagen'
              required
              fullWidth
              currentImageUrl={currentImageUrl}
            />
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
