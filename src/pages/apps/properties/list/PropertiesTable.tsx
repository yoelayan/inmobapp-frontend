"use client"
import React, { useMemo, useState, useEffect } from 'react';

import { useRouter } from 'next/navigation'

import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

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

import useProperties from '@/hooks/api/realstate/useProperties';
import useConfirmDialog from '@/hooks/useConfirmDialog'
import type { IRealProperty } from '@/types/apps/RealtstateTypes';

// Properties Card
import PropertiesCard from './PropertiesCard'

interface TableProps {
  properties: any
  refreshProperties: (filters?: Record<string, any>) => Promise<void>
  deleteProperty: (id: string) => Promise<void>
  title?: string
  subtitle?: string
}

const searchOnTag = (tag: any, row: any) => {
  if (row.characteristics === null || row.characteristics.length === 0) return null

  const value = row.characteristics.find((item: any) => item.code === tag.name)

  return value ? value.value : null
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

const PropertiesTable = ({ properties, refreshProperties, title, subtitle, deleteProperty }: TableProps) => {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()

  const { data, loading } = useProperties()

  const usePropertiesTableStore = useMemo(
    () =>
      createTableStore<IRealProperty>({
        data: properties || data,
        loading: loading,
        refresh: refreshProperties
      }),
    [properties, data, loading, refreshProperties]
  )

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    refreshProperties({ status__code: status })
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
            refreshProperties()
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
          buttons={[
            <Button
              key="add"
              variant='contained'
              color='primary'
              onClick={() => router.push('/propiedades/agregar')}
            >
              Agregar
            </Button>
          ]}
        />
        <Table columns={columns} state={tableStore} actions={actions}>
          <TableFilter placeholder='Buscar propiedades...'>
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
      <ConfirmDialog />
    </>
  )
};

export default React.memo(PropertiesTable);
