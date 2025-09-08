"use client"
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Chip, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import SecurityIcon from '@mui/icons-material/Security'

import type { ColumnDef } from '@tanstack/react-table'

import SectionHeader from '@/components/layout/horizontal/SectionHeader'
import DetailRoleModal from '@/pages/apps/roles/modals/DetailRole'

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
import useConfirmDialog from '@/hooks/useConfirmDialog'
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
    header: 'Cantidad de Permisos',
    enableColumnFilter: false,
    enableSorting: true,
    sortingFn: 'basic',
    cell: ({ getValue }) => {
      const permissions = getValue() as IUserGroup['permissions']
      const count = permissions?.length || 0

      return (
        <Chip
          label={`${count} permiso${count !== 1 ? 's' : ''}`}
          color={count > 0 ? 'primary' : 'default'}
          size="small"
          icon={<SecurityIcon />}
        />
      )
    }
  }
]

const RolesTable = () => {
  const router = useRouter()
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()
  const { data, loading, fetchData, deleteData: deleteRole } = useRoles()
  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<IUserGroup | null>(null)

  const handleOpenDetail = (role: IUserGroup) => {
    setSelectedRole(role)
    setOpen(true)
  }

  const useRolesTableStore = (
    () =>
      createTableStore<IUserGroup>({
        data: data,
        loading: loading,
        refresh: fetchData
      })
  )

  const rolesTableStore = useRolesTableStore()

  const actions: TableAction[] = [
    {
      label: 'Ver Permisos',
      onClick: (row: Record<string, any>) => {
        handleOpenDetail(row as IUserGroup)
      },
      icon: <VisibilityIcon fontSize='small' />
    },
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/roles/${row.id}/editar/`)
      },
      icon: <EditIcon fontSize='small' />
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        showConfirmDialog({
          title: 'Confirmar eliminación',
          message: `¿Estás seguro que deseas eliminar el rol "${row.name}"? Esta acción no se puede deshacer.`,
          onConfirm: async () => {
            await deleteRole(row.id)
            rolesTableStore.getState().fetchData()
          }
        })
      },
      icon: <DeleteIcon fontSize='small' />
    }
  ]

  return (
    <>
      <Grid container spacing={2}>
        <SectionHeader title='Roles' subtitle='Gestión de Roles del Sistema' />
        <Table columns={columns} state={rolesTableStore.getState()} actions={actions}>
          <TableFilter placeholder='Buscar roles...'>
            <Box className='flex gap-4 w-full'>
              <Button variant='outlined' size='small' onClick={() => rolesTableStore.getState().setFilters([])}>
                Limpiar filtros
              </Button>
              <Button
                key='update'
                startIcon={<RefreshIcon />}
                variant='contained'
                color='primary'
                onClick={() => rolesTableStore.getState().fetchData()}
              >
                Actualizar
              </Button>
              <Button
                key='add'
                startIcon={<AddIcon />}
                variant='contained'
                color='primary'
                onClick={() => router.push('/roles/agregar/')}
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
      </Grid>
      <ConfirmDialog />
      <DetailRoleModal
        open={open}
        onClose={() => setOpen(false)}
        role={selectedRole}
      />
    </>
  )
}

export default React.memo(RolesTable)
