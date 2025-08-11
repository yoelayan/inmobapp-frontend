"use client"
import React, { useMemo, useState, useEffect } from 'react'

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

import useRoles from '@/hooks/api/roles/useRoles'
import type { IUserGroup } from '@/types/apps/UserTypes'

const columns: ColumnDef<IUserGroup>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre del Rol',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric'
  },
]



const RolesTable = () => {
  const router = useRouter()
  const { fetchData, data, loading} = useRoles()


  const useRolesTableStore = useMemo(
    () =>
      createTableStore<IUserGroup>({
        data: data,
        loading: loading,
        refresh: fetchData
      }),
    []
  )

  const rolesTableStore = useRolesTableStore()


  const actions: TableAction[] = [
    {
      label: 'Ver',
      onClick: (row: Record<string, any>) => {
        router.push(`/roles/${row.id}/ver/`)
      }
    }
  ]

  return (
    <>
      <SectionHeader title='Roles' subtitle='Gestión de Roles del Sistema' />
      <Table columns={columns} state={rolesTableStore} actions={actions}>
        <TableFilter placeholder='Buscar roles...'>
          <Box className='flex gap-4 w-full'>
            <Button variant='outlined' size='small' onClick={() => rolesTableStore.setFilters([])}>
              Limpiar filtros
            </Button>
            <Button
              key='update'
              startIcon={<RefreshIcon />}
              variant='contained'
              color='primary'
              onClick={() => rolesTableStore.fetchData()}
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
    </>
  )
}

export default RolesTable
