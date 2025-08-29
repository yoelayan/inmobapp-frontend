'use client'

// React Imports
import React from 'react'

// Component Imports
import ClientsTable from '@/pages/apps/clients/list/ClientsTable'
import PermissionGuard from '@/auth/hocs/PermissionGuard'

const Clients: React.FC = () => {
  return (
    <PermissionGuard requiredPermissions={['view_client']}>
      <ClientsTable />
    </PermissionGuard>
  )
}

export default Clients
