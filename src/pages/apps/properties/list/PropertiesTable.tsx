'use client'
import React, { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'

import ImageIcon from '@mui/icons-material/Image'

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
  type TableAction
} from '@/components/common/Table'

import useConfirmDialog from '@/hooks/useConfirmDialog'
import { useNotification } from '@/hooks/useNotification'
import useProperties from '@/hooks/api/realstate/useProperties'
import { useAuth } from '@/auth/hooks/useAuth'
import type { IRealProperty } from '@/types/apps/RealtstateTypes'

// Properties Card
import PropertiesCard from './PropertiesCard'
import type { FilterItem, SortingItem } from '@/types/api/response'

const getColumns = (router: any): ColumnDef<IRealProperty>[] => [
  {
    accessorKey: 'images',
    header: 'Imagen',
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const images = row.original.images || []
      const coverImage = images.length > 0 ? images[0] : null

      if (!coverImage) {
        return <ImageIcon fontSize='small' />
      }

      return (
        <Box
          component='img'
          src={coverImage.image}
          alt='Portada'
          className='w-[50px] h-[50px] rounded border border-primary-200 object-cover'
        />
      )
    }
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric',
    cell: ({ row }) => {
      return (
        <Button
          variant="text"
          sx={{
            textAlign: 'left',
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontWeight: 'normal',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline'
            }
          }}
          onClick={() => router.push(`/propiedades/${row.original.id}`)}
        >
          {row.original.name}
        </Button>
      )
    }
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
    header: 'Precio',
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const price = getValue() as number

      return price ? `$${price.toLocaleString()}` : '$0'
    }
  },
  {
    accessorKey: 'status.name',
    header: 'Estado',
    enableColumnFilter: false
  }
]

const PropertiesTable = () => {
  const router = useRouter()
  const { notify } = useNotification()
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const { user } = useAuth()

  // ✅ CAMBIO: Usar hook directamente
  const {
    data: properties,
    loading,
    fetchData: fetchProperties,
    deleteData: deleteProperty
  } = useProperties()

  const usePropertiesTableStore = useMemo(
    () =>
      createTableStore<IRealProperty>({
        data: properties,
        loading: loading,
        refresh: fetchProperties
      }),
    [properties, loading, fetchProperties]
  )

  // ✅ FUNCIÓN DE FILTRADO POR STATUS
  const handleStatusChange = async (status: string) => {
    setStatusFilter(status)

    try {
      if (!status) {
        await fetchProperties()

        return
      }

      const filters: FilterItem[] = [{ field: 'status__code', value: status }]
      const sorting: SortingItem[] = []

      await fetchProperties({
        filters,
        page: 1,
        pageSize: 10,
        sorting
      })
    } catch (error) {
      console.error('Error filtering properties:', error)
    }
  }

  const handleClearFilters = async () => {
    setStatusFilter(null)
    const filters: FilterItem[] = []
    const sorting: SortingItem[] = []

    await fetchProperties({
      filters,
      page: 1,
      pageSize: 10,
      sorting
    })
  }

  // ✅ FUNCIONES DE ELIMINACIÓN
  const handleDeleteProperty = async (propertyId: number) => {
    try {
      await deleteProperty(propertyId)
      notify('Propiedad eliminada correctamente', 'success')
      fetchProperties()
    } catch (error) {
      notify('Error al eliminar la propiedad', 'error')
      console.error('Error deleting property:', error)
    }
  }

  const handleConfirmDelete = (row: Record<string, any>) => {
    const propertyName = row.name || 'esta propiedad'

    showConfirmDialog({
      title: 'Confirmar eliminación',
      message: `¿Está seguro de que desea eliminar "${propertyName}"? Esta acción no se puede deshacer.`,
      onConfirm: () => handleDeleteProperty(row.id),
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })
  }

  // Verificar si el usuario puede editar/eliminar la propiedad
  const canModifyProperty = (row: Record<string, any>) => {
    if (!user) return false

    // Si es superusuario, puede modificar cualquier propiedad
    if (user.is_superuser) return true

    // Si es el dueño asignado, puede modificar
    return row.assigned_to_id === user.id
  }

  const actions: TableAction[] = [
    {
      label: 'Ver',
      onClick: (row: Record<string, any>) => {
        router.push(`/propiedades/${row.id}`)
      },
      icon: <VisibilityIcon fontSize='small' />
    },
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/propiedades/${row.id}/editar/`)
      },
      icon: <EditIcon fontSize='small' />,
      condition: canModifyProperty
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        handleConfirmDelete(row)
      },
      icon: <DeleteIcon fontSize='small' />,
      condition: canModifyProperty
    }
  ]

  const tableStore = usePropertiesTableStore()
  const columns = getColumns(router)

  return (
    <>
      <Box sx={{ mb: 6 }}>
        <PropertiesCard onStatusChange={handleStatusChange} />
      </Box>

      <Grid container spacing={2}>
        <SectionHeader
          title='Propiedades'
          subtitle='Aquí puedes ver todas las propiedades disponibles'
        />
        <Table columns={columns} state={tableStore} actions={actions}>
          <TableFilter placeholder='Buscar propiedades...'>
            <Box className='flex gap-4 w-full'>
              <Button
                variant='outlined'
                size='small'
                onClick={handleClearFilters}
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

              <Button
                key='add'
                startIcon={<AddIcon />}
                variant='contained'
                color='primary'
                onClick={() => router.push('/propiedades/agregar')}
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
    </>
  )
}

export default React.memo(PropertiesTable)
