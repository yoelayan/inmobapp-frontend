'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import ClienteDetailCard from '@/views/apps/clients/detail/ClienteDetailCard'

const Clients: React.FC = () => {
  const { idcliente } = useParams() as { idcliente: string } // Asegura que `idcliente` es del tipo string

  return <ClienteDetailCard idcliente={idcliente} />
}

export default Clients
