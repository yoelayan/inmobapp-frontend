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

const columns: ColumnDef<IUser>[] = [
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
    accessorKey: 'group_names',
    header: 'Grupos',
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const groups = getValue() as string[]


return groups ? groups.join(', ') : ''
    }
  },
  {
    accessorKey: 'is_active',
    header: 'Activo',
    enableColumnFilter: true,
    filterFn: 'arrIncludes',
    cell: ({ getValue }) => {
      const isActive = getValue()


return (
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? 'Sí' : 'No'}
        </span>
      )
    }
  },
  {
    accessorKey: 'is_staff',
    header: 'Staff',
    enableColumnFilter: true,
    filterFn: 'arrIncludes',
    cell: ({ getValue }) => {
      const isStaff = getValue()


return (
        <span style={{ color: isStaff ? 'blue' : 'gray' }}>
          {isStaff ? 'Sí' : 'No'}
        </span>
      )
    }
  },
  {
    accessorKey: 'is_superuser',
    header: 'Superusuario',
    enableColumnFilter: true,
    filterFn: 'arrIncludes',
    cell: ({ getValue }) => {
      const isSuperuser = getValue()


return (
        <span style={{ color: isSuperuser ? 'purple' : 'gray' }}>
          {isSuperuser ? 'Sí' : 'No'}
        </span>
      )
    }
  },
  {
    accessorKey: 'date_joined',
    header: 'Fecha de Registro',
    enableColumnFilter: false
  },
  {
    accessorKey: 'last_login',
    header: 'Último Acceso',
    enableColumnFilter: false
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
                onClick={() => fetchData()}
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
