'use client'

import React from 'react'

import RolesTable from '@/pages/apps/roles/list/RolesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const RolesPage = () => {
  return (
    <div className="p-6">
      <BreadcrumbWrapper />
      <RolesTable />
    </div>
  )
}

export default RolesPage
