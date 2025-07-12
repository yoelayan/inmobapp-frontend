'use client'

// React Imports
import React from 'react'

// Component Imports
import { UserForm } from '@/pages/apps/users/form/UserForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

interface EditUserProps {
  params: {
    id: string
  }
}

const EditUser: React.FC<EditUserProps> = ({ params }) => {
  return (
    <>
      <BreadcrumbWrapper />
      <UserForm userId={params.id} />
    </>
  )
}

export default EditUser
