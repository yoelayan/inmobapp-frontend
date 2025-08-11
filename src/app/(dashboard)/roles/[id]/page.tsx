'use client'

// React Imports
import React from 'react'

// Component Imports
import { useRouter } from 'next/navigation'

import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import { PageContainer } from '@components/common/forms/Form'

type RoleDetailProps = {
  params: Promise<{
    id: string
  }>
}

const RoleDetail: React.FC<RoleDetailProps> = ({ params }) => {
  const router = useRouter()
  const { id } = React.use(params)
  const roleId = Number(id)

  // This could be expanded to show role details
  // For now, we'll redirect to edit
  React.useEffect(() => {
    router.push(`/roles/${id}/editar`)
  }, [id, router])

  return (
    <>
      <BreadcrumbWrapper />
      <PageContainer
        title="Cargando..."
        subtitle="Redirigiendo a la edición del rol..."
      >
        <div>Cargando detalles del rol...</div>
      </PageContainer>
    </>
  )
}

export default RoleDetail
