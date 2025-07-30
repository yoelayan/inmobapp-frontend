// forms/UserForm.tsx
import React from 'react'

import { useQuery } from '@tanstack/react-query'

import { Grid2 } from '@mui/material'

import type { z } from 'zod'

import { Form, FormField, PageContainer } from '@components/common/forms/Form'

import UsersRepository from '@services/repositories/users/UsersRepository'

import { userSchema, editUserSchema } from '@/validations/userSchema'



import useFranchises  from '@hooks/api/realstate/useFranchises'

type UserFormData = z.infer<typeof userSchema>
type EditUserFormData = z.infer<typeof editUserSchema>

interface UserFormProps {
  mode?: 'create' | 'edit'
  userId?: number
  onSuccess?: (user: UserFormData | EditUserFormData) => void
}

const UserForm = ({ mode = 'create', userId, onSuccess }: UserFormProps) => {
  const { fetchData: fetchFranchises } = useFranchises()


  const franchises = useQuery({
    queryKey: ['franchises'],
    queryFn: () => fetchFranchises(),
  })


  const handleSuccess = (userData: UserFormData | EditUserFormData) => {
    console.log(`Usuario ${mode === 'edit' ? 'actualizado' : 'creado'}:`, userData)
    onSuccess?.(userData)
  }

  const handleError = (error: any) => {
    console.error('Error en el formulario:', error)
  }

  // Default values for create mode
  const defaultValues: Partial<UserFormData> = {
    name: '',
    password: '',
    confirmPassword: '',
    image: '',
    email: '',
    franchise: franchises?.data?.results?.find(franchise => franchise.franchise_type === 'MASTER')?.id,
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
      >
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormField name='name' label='Nombre Completo' required fullWidth/>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormField name='email' type='email' label='Correo Electrónico' required fullWidth/>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormField name='password' type='password' label='Contraseña' required={mode === 'create'} fullWidth/>
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
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormField
              name='franchise'
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
          </Grid2>
        </Grid2>
      </Form>
    </PageContainer>
  )
}

export default UserForm
