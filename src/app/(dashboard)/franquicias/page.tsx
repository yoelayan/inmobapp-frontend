'use client'

// React Imports
import React from 'react'

// Component Imports
import FranchisesTable from '@/pages/apps/franchises/list/FranchisesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const Franchises: React.FC = () => {
  return (
    <>
      <BreadcrumbWrapper />
      <FranchisesTable />
    </>
  )
}

export default Franchises
