'use client'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import GroupIcon from '@mui/icons-material/Group'

import type { ColumnDef } from '@tanstack/react-table'

import SectionHeader from '@/components/layout/horizontal/SectionHeader'
import DetailFranchiseModal from '@/pages/apps/franchises/modals/DetailFranchise'
import EditParentFranchiseModal from '@/pages/apps/franchises/modals/EditParentFranchise'

import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TablePagination,
  TableFilter,
  createTableStore,
  type TableAction
} from '@/components/common/Table'

import useFranchises from '@/hooks/api/realstate/useFranchises'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'

import { type FranchiseTypes, mappedFranchiseTypes } from '@/validations/franchiseSchema'
import useConfirmDialog from '@/hooks/useConfirmDialog'
import { useNotification } from '@/hooks/useNotification';
import type { IUser } from '@/types/apps/UserTypes'



const FranchisesTable = () => {
  const router = useRouter()
  const { notify } = useNotification()
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()
  const { data, loading, fetchData, deleteData } = useFranchises()
  const [open, setOpen] = useState(false)
  const [selectedFranchise, setSelectedFranchise] = useState<IFranchise | null>(null)
  const [editParentOpen, setEditParentOpen] = useState(false)
  const [editParentFranchise, setEditParentFranchise] = useState<IFranchise | null>(null)

  const handleOpenDetail = (franchise: IFranchise) => {
    setSelectedFranchise(franchise)
    setOpen(true)
  }

  const handleOpenEditParent = (franchise: IFranchise) => {
    setEditParentFranchise(franchise)
    setEditParentOpen(true)
  }

  const handleEditParentSuccess = () => {
    tableStore.getState().fetchData() // Refresh the table
  }

  const useFranchisesTableStore = (
    () =>
      createTableStore<IFranchise>({
        data: data,
        loading: loading,
        refresh: fetchData
      })
  )

  const tableStore = useFranchisesTableStore()

  const handleDeleteFranchise = async (franchiseId: number) => {
    try {
      await deleteData(franchiseId)


      notify('Franquicia eliminada correctamente', 'success')

    } catch (error: any) {
      console.error('Error deleting franchise:', error)


    } finally {
      tableStore.getState().fetchData()
    }
  }

  const handleConfirmDelete = (row: Record<string, any>) => {
    const franchiseName = row.name || 'esta franquicia'

    showConfirmDialog({
      title: 'Confirmar eliminación',
      message: `¿Está seguro de que desea eliminar ${franchiseName}?`,
      onConfirm: () => handleDeleteFranchise(row.id),
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })
  }


const columns: ColumnDef<IFranchise>[] = [
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
      const type = getValue() as FranchiseTypes

      return mappedFranchiseTypes[type]
    }
  },
  {
    accessorKey: 'users',
    header: 'Usuarios',
    enableColumnFilter: false,
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const usersA = rowA.original.users?.length || 0
      const usersB = rowB.original.users?.length || 0

      return usersA - usersB
    },
    cell: ({ getValue }) => {
      const users = getValue() as IUser[]

      return (
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <GroupIcon fontSize="small" color="action" />
          <Chip
            label={users.length}
            color={users.length > 0 ? 'primary' : 'default'}
            size="small"
            variant="outlined"
          />
        </Box>
      )
    }
  },
  {
    accessorKey: 'parent',
    header: 'Franquicia Padre',
    enableColumnFilter: true,
    cell: ({ getValue, row }) => {
      const parent = getValue() as IFranchise
      const franchise = row.original as IFranchise


      if (franchise.franchise_type === 'MASTER') {
        return (
          <Chip label="Master" color="primary" size="small" variant="outlined" />
        )
      }

      return (
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <Button
            variant="text"
            color="primary"
            onClick={e => {
              e.stopPropagation()
              handleOpenEditParent(franchise)
            }}
            tabIndex={0}
            role="button"
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                handleOpenEditParent(franchise)
              }
            }}
          >
            {parent?.name || 'Sin padre'}
          </Button>
        </Box>
      )
    }
  }
]

  const actions: TableAction[] = [
    {
      label: 'Ver',
      onClick: (row: Record<string, any>) => {
        handleOpenDetail(row as IFranchise)
      },
      icon: <VisibilityIcon fontSize='small' />
    },
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/franquicias/${row.id}/editar/`)
      },
      icon: <EditIcon fontSize='small' />
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        handleConfirmDelete(row)
      },
      icon: <DeleteIcon fontSize='small' />
    }
  ]


  return (
    <>
      <Grid container spacing={2}>
        <SectionHeader title='Franquicias' subtitle='Gestión de Franquicias del Sistema' />
        <Table columns={columns} state={tableStore.getState()} actions={actions}>
          <TableFilter placeholder='Buscar franquicias...'>
            <Box className='flex gap-4 w-full'>
              <Button variant='outlined' size='small' onClick={() => tableStore.getState().setFilters([])}>
                Limpiar filtros
              </Button>
              <Button
                key='update'
                startIcon={<RefreshIcon />}
                variant='contained'
                color='primary'
                onClick={() => tableStore.getState().fetchData()}
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
      <ConfirmDialog />
      {selectedFranchise && (
        <DetailFranchiseModal open={open} onClose={() => setOpen(false)} franchise={selectedFranchise} />
      )}
      <EditParentFranchiseModal
        open={editParentOpen}
        onClose={() => setEditParentOpen(false)}
        franchise={editParentFranchise}
        onSuccess={handleEditParentSuccess}
      />
    </>
  )
}

export default React.memo(FranchisesTable)
