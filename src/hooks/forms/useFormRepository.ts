'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { FormRepository } from '@/types/common/forms.types'



interface UseFormRepositoryProps<T> {
  repository?: FormRepository
  mode?: 'create' | 'edit'
  entityId?: number
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
}

export const useFormRepository = <T>({
  repository,
  mode = 'create',
  entityId,
  onSuccess,
  onError
}: UseFormRepositoryProps<T>) => {
  const queryClient = useQueryClient()


  // Query para obtener datos en modo edición
  const { data: initialData, isLoading: isLoadingData } = useQuery({
    queryKey: [repository?.base_url, entityId],
    queryFn: () => repository?.get(entityId!),
    enabled: mode === 'edit' && !!entityId && !!repository
  })

  // Mutation para crear
  const createMutation = useMutation({
    mutationFn: (data: T) => repository!.create(data as Record<string, any>),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [repository?.base_url] })
      onSuccess?.(data)
    },
    onError
  })

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: (data: T) => repository!.update(entityId!, data as Record<string, any>),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: [repository?.base_url] })
      onSuccess?.(data)
    },
    onError
  })

  const submitForm = (data: T) => {
    if (mode === 'edit') {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  return {
    initialData,
    isLoadingData,
    submitForm,
    isLoading: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error || updateMutation.error
  }
}
