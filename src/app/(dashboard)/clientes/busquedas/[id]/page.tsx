'use client'

// React Imports
import React, { Suspense } from 'react'
import { useRouter } from 'next/navigation'

// Component Imports
import { SearchForm } from '@/pages/apps/searches/form/SearchForm'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

// Types

function SearchPageContent({ params }: any) {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirigir a la tabla de búsquedas
    router.push('/clientes/busquedas')
  }

  return (
    <>
      <BreadcrumbWrapper />
      <SearchForm searchId={params.id} onSuccess={handleSuccess} />
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
