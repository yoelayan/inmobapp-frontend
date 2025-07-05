'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

import UsersRepository from '@/services/repositories/users/UsersRepository'
import type { IUser, IUserFormData } from '@/types/apps/UserTypes'

export const useUserForm = (userId?: string, onSuccess?: (response: IUser) => void) => {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<IUserFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirm: '',
      is_active: true,
      is_staff: false,
      is_superuser: false,
      groups: []
    }
  })

  // Cargar datos si estamos editando
  useEffect(() => {
    if (userId) {
      setIsLoading(true)
      UsersRepository.get(Number(userId))
        .then(response => {
          if (response) {
            const user = response

            reset({
              name: user.name,
              email: user.email,
              is_active: user.is_active,
              is_staff: user.is_staff,
              is_superuser: user.is_superuser,
              groups: user.groups || []
            })
          }
        })
        .catch(error => {
          console.error('Error loading user:', error)
          setServerError('Error al cargar los datos del usuario')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [userId, reset])

  const onSubmit = async (data: IUserFormData) => {
    setServerError(null)

    // Validar contraseñas si es creación o si se proporcionó una nueva contraseña
    if (!userId || data.password) {
      if (data.password !== data.password_confirm) {
        setServerError('Las contraseñas no coinciden')

        return
      }
    }

    try {
      // Limpiar campos de confirmación de contraseña antes de enviar
      const { password_confirm, ...submitData } = data

      // Si no hay contraseña y es edición, eliminar el campo password
      if (userId && !submitData.password) {
        delete submitData.password
      }

      let response

      if (userId) {
        // Actualizar usuario existente
        response = await UsersRepository.update(parseInt(userId), submitData)
      } else {
        // Crear nuevo usuario
        response = await UsersRepository.create(submitData)
      }

      if (onSuccess) {
        onSuccess(response)
      } else {
        // Redirigir a la lista de usuarios
        router.push('/usuarios')
      }
    } catch (error: any) {
      console.error('Error saving user:', error)
      setServerError(error.message || 'Error al guardar el usuario')
    }
  }

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isLoading,
    serverError,
    setValue,
    watch
  }
}
