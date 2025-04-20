'use client';

import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { ClientForm } from '@/views/apps/clients/form/ClientForm';
import useClientStatus from '@/hooks/api/crm/useClientStatus'


const ClientPage: React.FC = () => {
  const params = useParams();
  const clientId = params?.id ? Number(params.id) : undefined; // Obtiene el ID de la URL si existe
  const isUpdateMode = !!clientId;

  const { data: statuses, fetchData, refreshData, loading: loadingStatuses } = useClientStatus()


  // --- Opcional: Cargar datos necesarios para el formulario (ej: lista de Status) ---
  useEffect(() => {
    console.log("fetch")
    fetchData();
  }, [fetchData]);



  if (loadingStatuses) {
    return <p>Cargando opciones...</p>;
  }

  return (
    <div>
      <h1>Actualizar Cliente</h1>
      <ClientForm
        clientId={clientId} // Pasa el ID si estamos actualizando
        statuses={statuses} // Pasa la lista de statuses al formulario
        // onSuccess={() => { /* Redirigir o mostrar mensaje */ }} // Callback opcional
      />
    </div>
  );
};

export default ClientPage;
