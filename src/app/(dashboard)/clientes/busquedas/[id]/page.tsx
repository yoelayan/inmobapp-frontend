'use client'

// React Imports
import React, { Suspense } from 'react'

// Component Imports
import { SearchForm } from '@/pages/apps/searches/form/SearchForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

// Types

function SearchPageContent({ params }: any) {
  return (
    <>
      <BreadcrumbWrapper />
      <SearchForm searchId={params.id} />
    </>
  )
}

const SearchPage = ({ params }: any) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent params={params} />
    </Suspense>
  )
}

export default SearchPage
