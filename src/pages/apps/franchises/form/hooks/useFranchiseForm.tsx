'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'
import type { IFranchise, IFranchiseFormData } from '@/types/apps/FranquiciaTypes'

export const useFranchiseForm = (franchiseId?: string, onSuccess?: (response: IFranchise) => void) => {
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
  } = useForm<IFranchiseFormData>({
    defaultValues: {
      identifier: '',
      name: '',
      franchise_type: 'COMMERCIAL',
      parent: undefined
    }
  })

  // Cargar datos si estamos editando
  useEffect(() => {
    if (franchiseId) {
      setIsLoading(true)
      FranchisesRepository.get(parseInt(franchiseId))
        .then(response => {
          if (response) {
            const franchise = response

            reset({
              identifier: franchise.identifier || '',
              name: franchise.name,
              franchise_type: franchise.franchise_type,
              parent: franchise.parent
            })
          }
        })
        .catch(error => {
          console.error('Error loading franchise:', error)
          setServerError('Error al cargar los datos de la franquicia')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [franchiseId, reset])

  const onSubmit = async (data: IFranchiseFormData) => {
    setServerError(null)

    try {
      let response

      if (franchiseId) {
        // Actualizar franquicia existente
        response = await FranchisesRepository.update(Number(franchiseId), data)
      } else {
        // Crear nueva franquicia
        response = await FranchisesRepository.create(data)
      }

      if (onSuccess) {
        onSuccess(response)
      } else {
        // Redirigir a la lista de franquicias
        router.push('/franquicias')
      }
    } catch (error: any) {
      console.error('Error saving franchise:', error)
      setServerError(error.message || 'Error al guardar la franquicia')
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
