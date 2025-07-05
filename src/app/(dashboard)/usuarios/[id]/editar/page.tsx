'use client'

// React Imports
import React from 'react'

// Component Imports
import { UserForm } from '@/pages/apps/users/form/UserForm'
import SectionHeader from '@/components/layout/horizontal/SectionHeader'

interface EditUserProps {
  params: {
    id: string
  }
}

const EditUser: React.FC<EditUserProps> = ({ params }) => {
  return (
    <>
      <SectionHeader title='Editar Usuario' subtitle='Modificar los datos del usuario' />
      <UserForm userId={params.id} />
    </>
  )
}

export default EditUser
