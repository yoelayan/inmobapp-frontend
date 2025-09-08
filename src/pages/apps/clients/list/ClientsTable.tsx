"use client"
import React from 'react';

import { useRouter } from 'next/navigation'

import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import type { ColumnDef } from '@tanstack/react-table'

import SectionHeader from '@/components/layout/horizontal/SectionHeader';

import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TablePagination,
  TableFilter,
  createTableStore,
  type TableAction,
} from '@/components/common/Table';

import useClients from '@/hooks/api/crm/useClients';
import type { IClient } from '@/types/apps/ClientesTypes';

const columns: ColumnDef<IClient>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric',
    meta: {
      priority: 10 // High priority - always show in mobile
    }
  },
  {
    accessorKey: 'email',
    header: 'Correo Electrónico',
    enableColumnFilter: true,
    meta: {
      priority: 9 // High priority - always show in mobile
    }
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    enableColumnFilter: false,
    meta: {
      priority: 8 // High priority - always show in mobile
    }
  },
  {
    accessorKey: 'assigned_to.name',
    header: 'Usuario Asignado',
    enableColumnFilter: false,
    meta: {
      priority: 5 // Medium priority - show in collapse on mobile
    }
  },

  {
    accessorKey: 'franchise.name',
    header: 'Franquicia',
    enableColumnFilter: true,
    meta: {
      priority: 4 // Lower priority - show in collapse on mobile
    }
  },
  {
    accessorKey: 'formated_created_at',
    header: 'Fecha de Creación',
    enableColumnFilter: false,
    meta: {
      priority: 3 // Lower priority - show in collapse on mobile
    }
  }
]

const ClientsTable = () => {
  const router = useRouter()
  const { data, loading, fetchData } = useClients()

  const useClientsTableStore = (
    () =>
      createTableStore<IClient>({
        data: data,
        loading: loading,
        refresh: fetchData
      })
  )

  const actions: TableAction[] = [
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/clientes/${row.id}/`)
      },
      icon: <EditIcon fontSize="small" />
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        console.log('Eliminar', row)

        // TODO: Implementar confirmación y eliminación
      },
      icon: <DeleteIcon fontSize="small" />
    }
  ]

  const tableStore = useClientsTableStore();

  return (
    <>
      <Grid container spacing={2}>
        <SectionHeader title='Clientes' subtitle='Listado de Clientes' />
        <Table columns={columns} state={tableStore.getState()} actions={actions}>
          <TableFilter placeholder='Buscar clientes...'>
            <Button variant='outlined' size='small' onClick={() => tableStore.getState().setFilters([])}>
              Limpiar filtros
            </Button>
            <Button key='add' variant='contained' color='primary' onClick={() => router.push('/clientes/agregar/')}>
              Agregar
            </Button>
          </TableFilter>

          <TableContainer>
            <TableHeader />
            <TableBody />
          </TableContainer>

          <TablePagination />
        </Table>
      </Grid>
    </>
  )
};

export default React.memo(ClientsTable);
