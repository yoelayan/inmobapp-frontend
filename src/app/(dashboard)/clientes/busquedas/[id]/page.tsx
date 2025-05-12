'use client'

// React Imports
import React, { Suspense } from 'react'

// Component Imports
import { SearchForm } from '@/views/apps/searches/form/SearchForm'

interface SearchPageProps {
  params: {
    id: string
  }
}

function SearchPageContent({ params }: SearchPageProps) {
  // Cast params to any to handle the Promise nature of params
  const unwrappedParams = React.use(params as any) as { id: string };

  return <SearchForm searchId={unwrappedParams.id} />
}

const SearchPage: React.FC<SearchPageProps> = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent params={props.params} />
    </Suspense>
  )
}

export default SearchPage
