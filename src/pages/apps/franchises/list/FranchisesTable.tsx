'use client'
import React, { useMemo, useState } from 'react'

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
import DetailFranchiseModal from '@/pages/apps/franchises/modals/DetailFranchise'

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



const FranchisesTable = () => {
  const router = useRouter()
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()
  const { data, loading, fetchData, deleteData: deleteFranchise } = useFranchises()
  const [open, setOpen] = useState(false)
  const [selectedFranchise, setSelectedFranchise] = useState<IFranchise | null>(null)

  const handleOpenDetail = (franchise: IFranchise) => {
    setSelectedFranchise(franchise)
    setOpen(true)
  }

  const useFranchisesTableStore = useMemo(
    () =>
      createTableStore<IFranchise>({
        data: data,
        loading: loading,
        refresh: fetchData
      }),
    []
  )

  const tableStore = useFranchisesTableStore()


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
    accessorKey: 'parent',
    header: 'Franquicia Padre',
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const parent = getValue() as IFranchise

      if (parent) {
        return (
          <Button
            variant="text"
            color="primary"
            onClick={e => {
              e.stopPropagation()
              handleOpenDetail(parent)
            }}
            tabIndex={0}
            role="button"
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                handleOpenDetail(parent)
              }
            }}
          >
            {parent.name}
          </Button>
        )
      }

      return '-'
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
        showConfirmDialog({
          title: 'Confirmar eliminación',
          message: `¿Estás seguro que deseas eliminar la franquicia "${row.name}"?`,
          onConfirm: async () => {
            await deleteFranchise(row.id)
            tableStore.fetchData()
          }
        })
      },
      icon: <DeleteIcon fontSize='small' />
    }
  ]


  return (
    <>
      <Grid container spacing={2}>
        <SectionHeader title='Franquicias' subtitle='Gestión de Franquicias del Sistema' />
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
                onClick={() => tableStore.fetchData()}
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
      <DetailFranchiseModal open={open} onClose={() => setOpen(false)} franchise={selectedFranchise} />
    </>
  )
}

export default React.memo(FranchisesTable)
