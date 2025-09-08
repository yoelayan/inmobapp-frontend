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
import Tooltip from '@mui/material/Tooltip'

import ImageIcon from '@mui/icons-material/Image'

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
  onStatusFilterChange?: (status: string | null) => void
}


const columns: ColumnDef<IRealProperty>[] = [
  {
    accessorKey: 'images',
    header: 'Imagen',
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const images = row.original.images || []
      const coverImage = images.length > 0 ? images[0] : null

      if (!coverImage) {
        return (
            <ImageIcon fontSize="small" />
        )
      }

      return (
        <Box
          component="img"
          src={coverImage.image}
          alt="Portada"
          className="w-[50px] h-[50px] rounded border border-primary-200 object-cover"
        />
      )
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
    accessorKey: 'municipality.name',
    header: 'Municipio',
    enableColumnFilter: true
  },
  {
    accessorKey: 'parish.name',
    header: 'Parroquia',
    enableColumnFilter: true
  },
  {
    accessorKey: 'type_negotiation.name',
    header: 'Tipo de Negociación',
    enableColumnFilter: false
  },
  {
    accessorKey: 'price',
    header: 'Precio (USD)',
    enableColumnFilter: false,
    cell: ({ row }) => {
      const price = row.original.price
      const rentPrice = row.original.rent_price
      const negotiationType = row.original.type_negotiation?.name

      // Si no hay ningún precio, mostrar vacío
      if (!price && !rentPrice) return ''

      // Si es "Venta y Alquiler", mostrar ambos precios
      if (negotiationType === 'Venta y Alquiler' && price && rentPrice) {
        return (
          <Box className='flex flex-col gap-1'>
            <Tooltip title='Precio de Venta' placement='top'>
              <Box className='text-sm'>
                <span className='text-green-600 font-bold'>V: </span>${Number(price).toLocaleString()}
              </Box>
            </Tooltip>
            <Tooltip title='Precio de Alquiler' placement='top'>
              <Box className='text-sm'>
                <span className='text-blue-600 font-bold'>A: </span>${Number(rentPrice).toLocaleString()}
              </Box>
            </Tooltip>
          </Box>
        )
      }

      // Para otros tipos, mostrar solo el precio correspondiente
      let displayPrice = null
      let priceType = ''

      if (negotiationType === 'Venta' && price) {
        displayPrice = price
        priceType = 'Venta'
      } else if (negotiationType === 'Alquiler' && rentPrice) {
        displayPrice = rentPrice
        priceType = 'Alquiler'
      }

      if (!displayPrice) return ''

      return (
        <Box>
          <Tooltip title={priceType}>
            <Box className="font-bold">
              ${Number(displayPrice).toLocaleString()}
            </Box>
          </Tooltip>
        </Box>
      )
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Fecha de Creación',
    enableColumnFilter: false
  }
]

const PropertiesTable = ({ properties, loading, fetchProperties, title, subtitle, deleteProperty, onStatusFilterChange }: TableProps) => {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()

  const usePropertiesTableStore = useMemo(
    () => {
      // Ensure properties has a default structure to prevent destructuring errors during SSR
      const safeProperties = properties || { results: [], count: 0, page_number: 1, num_pages: 0, next: null, previous: null }

      return createTableStore<IRealProperty>({
        data: safeProperties,
        loading: loading,
        refresh: fetchProperties
      })
    },
    [properties, loading, fetchProperties]
  )

    const handleStatusChange = async (status: string) => {
    setStatusFilter(status)

    try {
      // Si no hay status seleccionado, mostrar todas las propiedades
      if (!status) {
        await fetchProperties()

        return
      }

      // Aplicar filtro por status
      const filters = [{ field: 'status__code', value: status }]

      await fetchProperties({
        filters,
        page: 1,
        pageSize: 10,
        sorting: []
      })
    } catch (error) {
      console.error('Error filtering properties:', error)
    }
  }

  const actions: TableAction[] = [
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/propiedades/${row.id}/editar/`)
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


                            <Button
                variant='outlined'
                size='small'
                onClick={() => {
                  tableStore.setFilters([])
                  setStatusFilter(null)
                  onStatusFilterChange?.(null)
                  fetchProperties({ filters: [], page: 1, pageSize: 10, sorting: [] })
                }}
                disabled={!statusFilter && tableStore.filters.length === 0}
              >
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
