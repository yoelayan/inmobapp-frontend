'use client'

// React Imports
import React from 'react'

// Component Imports
import { UserForm } from '@/pages/apps/users/form/UserForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const AddUser: React.FC = () => {
  return (
    <>
      <BreadcrumbWrapper />
      <UserForm />
    </>
  )
}

export default AddUser
