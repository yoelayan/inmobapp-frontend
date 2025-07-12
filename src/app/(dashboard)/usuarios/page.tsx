'use client'

// React Imports
import React from 'react'

// Component Imports
import UsersTable from '@/pages/apps/users/list/UsersTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const Users: React.FC = () => {
  return (
    <>
      <BreadcrumbWrapper />
      <UsersTable />
    </>
  )
}

export default Users
