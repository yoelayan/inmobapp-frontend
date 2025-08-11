'use client'

// React Imports
import React from 'react'

// Component Imports
import { useRouter } from 'next/navigation'

import UserForm  from '@/pages/apps/users/form/UserForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import type { CreateUserFormData, EditUserFormData } from '@/validations/userSchema'

const AddUser: React.FC = () => {
  const router = useRouter()

  const handleSuccess = (data: CreateUserFormData | EditUserFormData) => {
    console.log(data)
    router.push(`/usuarios/`)
  }

  return (
    <>
      <BreadcrumbWrapper />
      <UserForm onSuccess={handleSuccess} />
    </>
  )
}

export default AddUser
