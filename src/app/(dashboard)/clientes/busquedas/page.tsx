'use client'

// React Imports
import React from 'react'

// Component Imports
import SearchesTable from '@/pages/apps/searches/list/SearchesTable'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const SearchesPage: React.FC = () => {
  return (
    <>
      <BreadcrumbWrapper />
      <SearchesTable />
    </>
  )
}

export default SearchesPage
