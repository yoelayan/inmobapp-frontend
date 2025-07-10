"use client"
import React, { useMemo } from 'react';

import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2'

import EditIcon from '@mui/icons-material/Edit'

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
    enableColumnFilter: false,
    enableSorting: true,
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    enableColumnFilter: false
  },
  {
    accessorKey: 'status_name',
    header: 'Estado',
    enableColumnFilter: true,
    filterFn: 'arrIncludes',
    cell: ({ getValue }) => {
      const status = getValue()

      return (
        <span style={{ color: status === 'Activo' ? 'green' : 'red' }}>
          {status === 'Activo' ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  },
  {
    accessorKey: 'franchise_name',
    header: 'Franquicia'
  },
  {
    accessorKey: 'assigned_to_name',
    header: 'Asignado a'
  }
]

const UsuariosTable = () => {

  console.log("UsuariosTable")


  const { data, loading, fetchData } = useClients()

  const useClientsTableStore = useMemo(
    () =>
      createTableStore<IClient>({
        data: data,
        loading: loading,
        refresh: fetchData
      }),
    []
  )

  const actions: TableAction[] = [
    {
      label: 'Editar',
      onClick: (row: IClient) => {
        console.log(row)
      },
      icon: <EditIcon fontSize="small" />
    }
  ]

  const tableStore = useClientsTableStore();


  return (
    <Grid container spacing={2}>
      <SectionHeader title='Clientes' subtitle='Lista de clientes' buttons={[]} />
      <Table columns={columns} state={tableStore} actions={actions}>
        <TableFilter placeholder='Buscar clientes...'>
          <Button variant='outlined' size='small' onClick={() => tableStore.setFilters([])}>
            Limpiar filtros
          </Button>
        </TableFilter>

        <TableContainer>
          <TableHeader />
          <TableBody />
        </TableContainer>

        <TablePagination />
      </Table>
    </Grid>

  )
};

export default React.memo(UsuariosTable);
