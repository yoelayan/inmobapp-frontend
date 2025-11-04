'use client'

// React Imports
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// Component Imports
import { Alert, Box, Button } from '@mui/material'

import FranchiseForm from '@/pages/apps/franchises/form/FranchiseForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import PermissionGuard from '@/auth/hocs/PermissionGuard'
import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'
import { useNotification } from '@/hooks/useNotification'

import type { EditFranchiseFormData } from '@/validations/franchiseSchema'


type EditFranchiseProps = {
  params: Promise<{
    id: string
  }>
}


const EditFranchise: React.FC<EditFranchiseProps> = ({ params }) => {
  const router = useRouter()
  const { notify } = useNotification()
  const [loading, setLoading] = useState(true)
  const [isMaster, setIsMaster] = useState(false)

  const { id } = React.use(params)
  const franchiseId = Number(id)

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        setLoading(true)
        const franchiseData = await FranchisesRepository.get(franchiseId)

        setIsMaster(franchiseData.franchise_type === 'MASTER')

        if (franchiseData.franchise_type === 'MASTER') {
          notify('No se puede editar una franquicia MASTER', 'error')
        }
      } catch (error) {
        console.error('Error fetching franchise:', error)
        notify('Error al cargar la franquicia', 'error')
        router.push('/franquicias/')
      } finally {
        setLoading(false)
      }
    }

    if (franchiseId) {
      fetchFranchise()
    }
  }, [franchiseId, router, notify])

  const handleSuccess = (data: EditFranchiseFormData) => {
    console.log(data)
    router.push(`/franquicias/`)
  }

  if (loading) {
    return (
      <PermissionGuard requiredPermissions={['change_franchise']}>
        <BreadcrumbWrapper />
        <Box sx={{ p: 3 }}>Cargando...</Box>
      </PermissionGuard>
    )
  }

  if (isMaster) {
    return (
      <PermissionGuard requiredPermissions={['change_franchise']}>
        <BreadcrumbWrapper />
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            No se puede editar una franquicia MASTER. Esta acción está bloqueada por seguridad.
          </Alert>
          <Button variant="contained" onClick={() => router.push('/franquicias/')}>
            Volver a la lista
          </Button>
        </Box>
      </PermissionGuard>
    )
  }

  return (
    <PermissionGuard requiredPermissions={['change_franchise']}>
      <BreadcrumbWrapper />
      <FranchiseForm franchiseId={franchiseId} mode='edit' onSuccess={handleSuccess} />
    </PermissionGuard>
  )
}

export default EditFranchise
