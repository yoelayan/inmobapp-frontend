"use client"
import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation'

import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
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

import useConfirmDialog from '@/hooks/useConfirmDialog'
import type { IRealProperty } from '@/types/apps/RealtstateTypes';

// Properties Card
import PropertiesCard from './PropertiesCard'
import type { FilterItem, ResponseAPI, SortingItem } from '@/types/api/response';

interface TableProps {
  properties: any
  loading: boolean
  fetchProperties: (
    params?: { page: number, pageSize: number, filters: FilterItem[], sorting: SortingItem[] }
  ) => Promise<ResponseAPI<IRealProperty>>

  deleteProperty: (id: string) => Promise<void>
  title?: string
  subtitle?: string
}


const columns: ColumnDef<IRealProperty>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'assigned_to.email',
    header: 'Asignado a',
    enableColumnFilter: true
  },
  {
    accessorKey: 'state.name',
    header: 'Estado',
    enableColumnFilter: true
  },
  {
    accessorKey: 'city.name',
    header: 'Ciudad',
    enableColumnFilter: true
  },
  {
    accessorKey: 'type_negotiation.name',
    header: 'Tipo de Inmueble',
    enableColumnFilter: false
  },
  {
    accessorKey: 'price',
    header: 'Precio (USD)',
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const price = getValue()


      return price ? `$${Number(price).toLocaleString()}` : ''
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Fecha de Creación',
    enableColumnFilter: false
  }
]

const PropertiesTable = ({ properties, loading, fetchProperties, title, subtitle, deleteProperty }: TableProps) => {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()

  const usePropertiesTableStore = useMemo(
    () =>
      createTableStore<IRealProperty>({
        data: properties,
        loading: loading,
        refresh: fetchProperties
      }),
    []
  )

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    fetchProperties({ filters: [{ field: 'status__code', value: statusFilter }], page: 1, pageSize: 10, sorting: [] })
  }

  const actions: TableAction[] = [
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/propiedades/${row.id}/`)
      },
      icon: <EditIcon fontSize="small" />
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        showConfirmDialog({
          title: 'Confirmar eliminación',
          message: `¿Estás seguro que deseas eliminar la propiedad "${row.name}"?`,
          onConfirm: async () => {
            await deleteProperty(row.id)
            fetchProperties()
          }
        })
      },
      icon: <DeleteIcon fontSize="small" />
    }
  ]

  const tableStore = usePropertiesTableStore();

  return (
    <>
      <Box sx={{ mb: 6 }}>
        <PropertiesCard onStatusChange={handleStatusChange} />
      </Box>

      <Grid container spacing={2}>
        <SectionHeader
          title={title || 'Propiedades'}
          subtitle={subtitle || 'Aquí puedes ver todas las propiedades disponibles'}
        />
        <Table columns={columns} state={tableStore} actions={actions}>
          <TableFilter placeholder='Buscar propiedades...'>
            <Box className='flex gap-4 w-full'>
              <Button variant='outlined' size='small' onClick={() => tableStore.setFilters([])}>
                Limpiar filtros
              </Button>
              <Button
                key='update'
                startIcon={<RefreshIcon />}
                variant='contained'
                color='primary'
                onClick={() => fetchProperties()}
              >
                Actualizar
              </Button>
              {/* <Can permission='add_property'> */}
                <Button
                  key='add'
                  startIcon={<AddIcon />}
                  variant='contained'
                  color='primary'
                  onClick={() => router.push('/propiedades/agregar')}
                >
                  Agregar
                </Button>
              {/* </Can> */}
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
    </>
  )
};

export default React.memo(PropertiesTable);
