"use client"
import React, { useMemo } from 'react';

import { useRouter } from 'next/navigation'

import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import GroupIcon from '@mui/icons-material/Group'
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

import useUsers from '@/hooks/api/users/useUsers';
import type { IUser } from '@/types/apps/UserTypes';

import { formatDate, formatDateTime } from '@utils/date';

const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: 'franchise',
    header: 'Franquicia',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric',
    cell: ({ row }) => {
      return row.original.franchise?.name
    }
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableColumnFilter: true
  },

  {
    accessorKey: 'date_joined',
    header: 'Fecha de Registro',
    enableColumnFilter: false,
    cell: ({ row }) => {
      return formatDate(row.original.date_joined || '')
    }
  },
  {
    accessorKey: 'last_login',
    header: 'Último Acceso',
    enableColumnFilter: false,
    cell: ({ row }) => {
      if (!row.original.last_login) return 'Nunca'

      return formatDateTime(row.original.last_login)
    }
  },
  {
    accessorKey: 'user_permissions',
    header: 'Permisos',
    enableColumnFilter: false,
    cell: ({ row }) => {
      // Length of user_permissions
      return row.original.user_permissions?.length || 0
    }
  }
]

const UsersTable = () => {
  const router = useRouter()
  const { data, loading, fetchData } = useUsers()

  const useUsersTableStore = useMemo(
    () =>
      createTableStore<IUser>({
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
        router.push(`/usuarios/${row.id}/ver/`)
      },
      icon: <VisibilityIcon fontSize="small" />
    },
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/usuarios/${row.id}/editar/`)
      },
      icon: <EditIcon fontSize="small" />
    },
    {
      label: 'Gestionar Grupos',
      onClick: (row: Record<string, any>) => {
        router.push(`/usuarios/${row.id}/grupos/`)
      },
      icon: <GroupIcon fontSize="small" />
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        console.log('Eliminar usuario', row)

        // TODO: Implementar confirmación y eliminación
      },
      icon: <DeleteIcon fontSize="small" />
    }
  ]

  const tableStore = useUsersTableStore();

  return (
    <>
      <Grid container spacing={2}>
        <SectionHeader
          title='Usuarios'
          subtitle='Gestión de Usuarios del Sistema'
        />
        <Table columns={columns} state={tableStore} actions={actions}>
          <TableFilter placeholder='Buscar usuarios...'>
            <Box className='flex gap-4 w-full'>
              <Button variant='outlined' size='small' onClick={() => tableStore.setFilters([])}>
                Limpiar filtros
              </Button>
              <Button
                key='update'
                startIcon={<RefreshIcon />}
                variant='contained'
                color='primary'
                onClick={() => tableStore.fetchData()}
              >
                Actualizar
              </Button>
              <Button
                key='add'
                startIcon={<AddIcon />}
                variant='contained'
                color='primary'
                onClick={() => router.push('/usuarios/agregar/')}
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

export default React.memo(UsersTable);
