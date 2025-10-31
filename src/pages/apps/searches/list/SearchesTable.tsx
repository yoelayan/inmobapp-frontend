"use client"
import React, { useState, useRef, useEffect } from 'react';

import { useRouter } from 'next/navigation'

import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import SearchIcon from '@mui/icons-material/Search'
import HistoryIcon from '@mui/icons-material/History'
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

// Component Imports
import AddSearchObservationModal from '../form/AddSearchObservationModal'
import ObservationsLogModal from '@/components/apps/searches/modals/ObservationsLogModal'
import SearchCharacteristicModalV2 from '../form/SearchCharacteristicModal'

// Hooks Imports
import useSearches from '@/hooks/api/crm/useSearches';
import { useNotification } from '@/hooks/useNotification';
import useConfirmDialog from '@/hooks/useConfirmDialog';
import type { ISearch } from '@/types/apps/SearchTypes';

// Location repositories removed: column filters handle this now

const columns: ColumnDef<ISearch>[] = [
  {
    accessorKey: 'client.name',
    header: 'Cliente',
    enableColumnFilter: true,
    enableSorting: true,
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    enableColumnFilter: true
  },
  {
    accessorKey: 'budget',
    header: 'Presupuesto',
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const budget = getValue()

      return budget ? `$${Number(budget).toLocaleString()}` : ''
    }
  },
  {
    accessorKey: 'state_id',
    header: 'Estado',
    enableColumnFilter: true,
    cell: ({ row, getValue }) => ((row.original as ISearch).state?.name ?? (getValue() ? String(getValue()) : ''))
  },
  {
    accessorKey: 'municipality_id',
    header: 'Municipio',
    enableColumnFilter: true,
    cell: ({ row, getValue }) => ((row.original as ISearch).municipality?.name ?? (getValue() ? String(getValue()) : ''))
  },
  {
    accessorKey: 'parish_id',
    header: 'Parroquia',
    enableColumnFilter: true,
    cell: ({ row, getValue }) => ((row.original as ISearch).parish?.name ?? (getValue() ? String(getValue()) : ''))
  },
  {
    accessorKey: 'characteristics',
    header: 'Características',
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const characteristics = getValue() as any[]

      if (!characteristics || characteristics.length === 0) return '0'

      return `${characteristics.length}`
    }
  }
]

const SearchesTable = () => {
  const router = useRouter()
  const { notify } = useNotification()
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()
  const [characteristicModalOpen, setCharacteristicModalOpen] = useState(false)
  const [observationModalOpen, setObservationModalOpen] = useState(false)
  const [observationsLogModalOpen, setObservationsLogModalOpen] = useState(false)
  const [selectedSearchId, setSelectedSearchId] = useState<number | null>(null)
  const [selectedSearch, setSelectedSearch] = useState<any>(null)

  const { data, loading, fetchData, refreshData, deleteData } = useSearches()

  // Crear el store una sola vez y mantenerlo entre renders
  const tableStoreRef = useRef<ReturnType<typeof createTableStore<ISearch>> | null>(null)
  
  if (!tableStoreRef.current) {
    tableStoreRef.current = createTableStore<ISearch>({
      data: data,
      loading: loading,
      refresh: fetchData
    })
  }

  const tableStore = tableStoreRef.current

  // Actualizar el store cuando cambien los datos o el loading del hook
  useEffect(() => {
    tableStore.setState({
      data: data.results || [],
      loading: loading,
      totalCount: data.count || 0,
      totalPages: data.num_pages || 1,
      pageIndex: (data.page_number || 1) - 1
    })
  }, [data, loading, tableStore])


  const handleOpenCharacteristicModal = (searchId: number) => {
    setSelectedSearchId(searchId)
    setCharacteristicModalOpen(true)
  }

  const handleCloseCharacteristicModal = () => {
    setCharacteristicModalOpen(false)
  }

  const handleOpenObservationModal = (searchId: number) => {
    setSelectedSearchId(searchId)
    setObservationModalOpen(true)
  }

  const handleCloseObservationModal = () => {
    setObservationModalOpen(false)
  }

  const handleOpenObservationsLogModal = (search: any) => {
    setSelectedSearchId(search.id)
    setSelectedSearch(search)
    setObservationsLogModalOpen(true)
  }

  const handleCloseObservationsLogModal = () => {
    setObservationsLogModalOpen(false)
  }

  const handleObservationAdded = () => {
    refreshData()
  }

  const handleCharacteristicAdded = () => {
    refreshData()
  }

  const handleObservationsLogAdded = async () => {
    notify('Observación eliminada correctamente', 'success')
    await refreshData()

    // Si el modal de observaciones sigue abierto, actualizar los datos del search seleccionado
    if (observationsLogModalOpen && selectedSearchId) {
      const updatedData = data?.results || []
      const updatedSearch = updatedData.find((search: any) => search.id === selectedSearchId)

      if (updatedSearch) {
        setSelectedSearch(updatedSearch)
      }
    }
  }


  const handleDeleteSearch = async (searchId: number) => {
    try {
      await deleteData(searchId)
      notify('Búsqueda eliminada correctamente', 'success')
    } catch (error) {
      notify('Error al eliminar la búsqueda', 'error')
    } finally {
      // Refrescar desde el store para respetar filtros/paginación y manejar loading
      tableStore.getState().fetchData()
    }
  }

  const handleConfirmDelete = (row: Record<string, any>) => {
    const searchDescription = row.description || 'esta búsqueda'

    showConfirmDialog({
      title: 'Confirmar eliminación',
      message: `¿Está seguro de que desea eliminar ${searchDescription}? Esta acción no se puede deshacer.`,
      onConfirm: () => handleDeleteSearch(row.id),
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })
  }

  const actions: TableAction[] = [
    {
      label: 'Añadir Característica',
      onClick: (row: Record<string, any>) => {
        handleOpenCharacteristicModal(row.id)
      },
      icon: <AddCircleOutlineIcon fontSize="small" />
    },
    {
      label: 'Añadir Observación',
      onClick: (row: Record<string, any>) => {
        handleOpenObservationModal(row.id)
      },
      icon: <AddCircleOutlineIcon fontSize="small" />
    },
    {
      label: 'Ver Bitácora',
      onClick: (row: Record<string, any>) => {
        handleOpenObservationsLogModal(row)
      },
      icon: <HistoryIcon fontSize="small" />
    },
    {
      label: 'Ver Coincidencias',
      onClick: (row: Record<string, any>) => {
        router.push(`/clientes/${row.id}/coincidencias`)
      },
      icon: <SearchIcon fontSize="small" />
    },
    {
      label: 'Editar',
      onClick: (row: Record<string, any>) => {
        router.push(`/clientes/busquedas/${row.id}/`)
      },
      icon: <EditIcon fontSize="small" />
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        handleConfirmDelete(row)


      },
      icon: <DeleteIcon fontSize="small" />
    }
  ]

  return (
    <>
      <Grid container spacing={2}>
        <SectionHeader
          title='Búsquedas de Clientes'
          subtitle='Listado de Búsquedas'
        />
        <Table columns={columns} state={tableStore.getState()} actions={actions}>
          <TableFilter placeholder='Buscar búsquedas...'>
            <Box className='flex gap-4 w-full'>
              <Button variant='outlined' size='small' onClick={() => {
                tableStore.getState().setFilters([])
                tableStore.getState().fetchData()
              }}>
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
                onClick={() => router.push('/clientes/busquedas/agregar')}
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



      {observationModalOpen && (
        <AddSearchObservationModal
          open={observationModalOpen}
          onClose={handleCloseObservationModal}
          searchId={selectedSearchId ?? null}
          onSuccess={handleObservationAdded}
        />
      )}

      {observationsLogModalOpen && selectedSearch && (
        <ObservationsLogModal
          open={observationsLogModalOpen}
          onClose={handleCloseObservationsLogModal}
          searchId={selectedSearchId ?? null}
          observations={selectedSearch.observations || []}
          onSuccess={handleObservationsLogAdded}
        />
      )}

      {characteristicModalOpen && (
        <SearchCharacteristicModalV2
          open={characteristicModalOpen}
          onClose={handleCloseCharacteristicModal}
          searchId={selectedSearchId ?? null}
          onSuccess={handleCharacteristicAdded}
        />
      )}

      <ConfirmDialog />
    </>
  )
};

export default React.memo(SearchesTable);
