'use client'

// React Imports
import React from 'react'

// Component Imports
import { useRouter } from 'next/navigation'

import type { EditUserFormData } from '@validations/userSchema'

import UserForm from '@/pages/apps/users/form/UserForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

type EditUserProps = {
  params: Promise<{
    id: string
  }>
}

const EditUser: React.FC<EditUserProps> = ({ params }) => {
  const router = useRouter()

  const handleSuccess = (data: EditUserFormData) => {
    console.log(data)
    router.push(`/usuarios/`)
  }

  const { id } = React.use(params)
  const franchiseId = Number(id)

  return (
    <>
      <BreadcrumbWrapper />
      <UserForm userId={franchiseId} mode='edit' onSuccess={handleSuccess} />
    </>
  )
}

export default EditUser
