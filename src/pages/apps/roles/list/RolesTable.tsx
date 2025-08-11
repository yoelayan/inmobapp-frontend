"use client"
import React, { useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'

import type { ColumnDef } from '@tanstack/react-table'

import SectionHeader from '@/components/layout/horizontal/SectionHeader'

import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TablePagination,
  TableFilter,
  createTableStore,
  type TableAction,
} from '@/components/common/Table'

import useUsers from '@/hooks/api/users/useUsers'
import type { IUserGroup } from '@/types/apps/UserTypes'

const columns: ColumnDef<IUserGroup>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre del Rol',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'permissions',
    header: 'Permisos',
    enableColumnFilter: false,
    cell: ({ row }) => {
      // Show number of permissions
      return row.original.permissions?.length || 0
    }
  }
]

const RolesTable = () => {
  const router = useRouter()
  const { getGroups, loading, data, refreshData } = useUsers()

  // Fetch groups (roles) on mount
  const [groups, setGroups] = React.useState<IUserGroup[]>([])
  const [groupsLoading, setGroupsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    setGroupsLoading(true)
    getGroups()
      .then(res => {
        setGroups(res?.results || [])
      })
      .finally(() => setGroupsLoading(false))
  }, [])

  const useRolesTableStore = useMemo(
    () =>
      createTableStore<IUserGroup>({
        data: groups,
        loading: groupsLoading,
        refresh: async () => {
          setGroupsLoading(true)
          const res = await getGroups()
          setGroups(res?.results || [])
          setGroupsLoading(false)
        }
      }),
    [groups, groupsLoading, getGroups]
  )

  const actions: TableAction[] = [
    {
      label: 'Ver',
      onClick: (row: Record<string, any>) => {
        router.push(`/roles/${row.id}/ver/`)
      },
      icon: <VisibilityIcon fontSize="small" />
    },
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/roles/${row.id}/editar/`)
      },
      icon: <EditIcon fontSize="small" />
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        // Implement delete logic here
        // For now, just alert
        alert(`Eliminar rol: ${row.name}`)
      },
      icon: <DeleteIcon fontSize="small" />
    }
  ]

  return (
    <div className="p-4">
      <SectionHeader
        title="Roles"
        actions={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => router.push('/roles/crear/')}
            className="!bg-blue-600 hover:!bg-blue-700 text-white"
          >
            Crear Rol
          </Button>
        }
        className="mb-4"
      />
      <Table columns={columns} state={useRolesTableStore} actions={actions}>
        <TableFilter placeholder='Buscar roles...'>
          <Box className='flex gap-4 w-full'>
            <Button variant='outlined' size='small' onClick={() => useRolesTableStore.setFilters([])}>
              Limpiar filtros
            </Button>
            <Button
              key='update'
              startIcon={<RefreshIcon />}
              variant='contained'
              color='primary'
              onClick={() => useRolesTableStore.refresh()}
            >
              Actualizar
            </Button>
            <Button
              key='add'
              startIcon={<AddIcon />}
              variant='contained'
              color='primary'
              onClick={() => router.push('/roles/crear/')}
            >
              Crear Rol
            </Button>
          </Box>
        </TableFilter>
        <TableContainer>
          <TableHeader />
          <TableBody />
        </TableContainer>
        <TablePagination />
      </Table>
    </div>
  )
}

export default RolesTable
