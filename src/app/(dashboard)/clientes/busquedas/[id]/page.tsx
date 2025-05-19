'use client'

// React Imports
import React, { Suspense } from 'react'

// Component Imports
import { SearchForm } from '@/views/apps/searches/form/SearchForm'

// Types
type SearchPageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

function SearchPageContent({ params }: SearchPageProps) {
  return <SearchForm searchId={params.id} />
}

const SearchPage = ({ params }: SearchPageProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent params={params} />
    </Suspense>
  )
}

export default SearchPage
