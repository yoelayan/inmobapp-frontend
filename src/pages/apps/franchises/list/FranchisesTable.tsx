"use client"
import React, { useMemo } from 'react';

import { useRouter } from 'next/navigation'

import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'

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

import useFranchises from '@/hooks/api/realstate/useFranchises';
import type { IFranchise } from '@/types/apps/FranquiciaTypes';

const columns: ColumnDef<IFranchise>[] = [
  {
    accessorKey: 'identifier',
    header: 'Identificador',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'franchise_type',
    header: 'Tipo',
    enableColumnFilter: true,
    filterFn: 'arrIncludes',
    cell: ({ getValue }) => {
      const type = getValue()


return type === 'COMMERCIAL' ? 'Comercial' : 'Personal'
    }
  },
  {
    accessorKey: 'parent_name',
    header: 'Franquicia Padre',
    enableColumnFilter: false
  },
  {
    accessorKey: 'is_active',
    header: 'Estado',
    enableColumnFilter: true,
    filterFn: 'arrIncludes',
    cell: ({ getValue }) => {
      const isActive = getValue()


return (
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Fecha de Creación',
    enableColumnFilter: false
  }
]

const FranchisesTable = () => {
  const router = useRouter()
  const { data, loading, fetchData } = useFranchises()

  const useFranchisesTableStore = useMemo(
    () =>
      createTableStore<IFranchise>({
        data: data,
        loading: loading,
        refresh: fetchData
      }),
    []
  )

  const actions: TableAction[] = [
    {
      label: 'Ver',
      onClick: (row: Record<string, any>) => {
        router.push(`/franquicias/${row.id}/ver/`)
      },
      icon: <VisibilityIcon fontSize="small" />
    },
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/franquicias/${row.id}/editar/`)
      },
      icon: <EditIcon fontSize="small" />
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        console.log('Eliminar franquicia', row)

        // TODO: Implementar confirmación y eliminación
      },
      icon: <DeleteIcon fontSize="small" />
    }
  ]

  const tableStore = useFranchisesTableStore();

  return (
    <>
      <Grid container spacing={2}>
        <SectionHeader
          title='Franquicias'
          subtitle='Gestión de Franquicias del Sistema'
        />
        <Table columns={columns} state={tableStore} actions={actions}>
          <TableFilter placeholder='Buscar franquicias...'>
            <Box className='flex gap-4 w-full'>
              <Button variant='outlined' size='small' onClick={() => tableStore.setFilters([])}>
                Limpiar filtros
              </Button>
              <Button
                key='update'
                startIcon={<RefreshIcon />}
                variant='contained'
                color='primary'
                onClick={() => fetchData()}
              >
                Actualizar
              </Button>
              <Button
                key='add'
                startIcon={<AddIcon />}
                variant='contained'
                color='primary'
                onClick={() => router.push('/franquicias/agregar/')}
              >
                Agregar
              </Button>
            </Box>
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

export default React.memo(FranchisesTable);
