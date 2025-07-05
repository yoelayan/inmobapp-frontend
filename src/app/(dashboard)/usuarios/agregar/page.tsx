'use client'

// React Imports
import React from 'react'

// Component Imports
import { UserForm } from '@/pages/apps/users/form/UserForm'
import SectionHeader from '@/components/layout/horizontal/SectionHeader'

const AddUser: React.FC = () => {
  return (
    <>
      <SectionHeader title='Agregar Usuario' subtitle='Crear un nuevo usuario en el sistema' />
      <UserForm />
    </>
  )
}

export default AddUser
