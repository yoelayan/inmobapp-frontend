"use client"
import React, { useMemo, useState, useEffect } from 'react';

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
import AddSearchCharacteristicModal from '../form/AddSearchCharacteristicModal'
import AddSearchObservationModal from '../form/AddSearchObservationModal'
import ObservationsLogModal from '../form/ObservationsLogModal'

// Hooks Imports
import useSearches from '@/hooks/api/crm/useSearches';
import { useNotification } from '@/hooks/useNotification';
import type { ISearch } from '@/types/apps/ClientesTypes';

const columns: ColumnDef<ISearch>[] = [
  {
    accessorKey: 'client__name',
    header: 'Nombre',
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
    accessorKey: 'characteristics',
    header: 'Características',
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const characteristics = getValue() as any[]

      if (!characteristics || characteristics.length === 0) return 'Sin características'

      return (
        <div>
          {characteristics.map((char: any, index: number) => (
            <span key={index} style={{ display: 'block', fontSize: '0.8em' }}>
              {char.characteristic?.name}: {char.value}
            </span>
          ))}
        </div>
      )
    }
  }
]

const SearchesTable = () => {
  const router = useRouter()
  const { notify } = useNotification()
  const [characteristicModalOpen, setCharacteristicModalOpen] = useState(false)
  const [observationModalOpen, setObservationModalOpen] = useState(false)
  const [observationsLogModalOpen, setObservationsLogModalOpen] = useState(false)
  const [selectedSearchId, setSelectedSearchId] = useState<number | null>(null)
  const [selectedSearch, setSelectedSearch] = useState<any>(null)

  const { data, loading, fetchData, refreshData } = useSearches()

  const useSearchesTableStore = useMemo(
    () =>
      createTableStore<ISearch>({
        data: data,
        loading: loading,
        refresh: refreshData
      }),
    []
  )

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

  const handleSearchDeleted = () => {
    notify('Búsqueda eliminada correctamente', 'success')
    refreshData()
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
        router.push(`/clientes/search/${row.id}/`)
      },
      icon: <EditIcon fontSize="small" />
    },
    {
      label: 'Eliminar',
      onClick: (row: Record<string, any>) => {
        console.log('Eliminar', row)

        // TODO: Implementar confirmación y eliminación
      },
      icon: <DeleteIcon fontSize="small" />
    }
  ]

  const tableStore = useSearchesTableStore();

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <Grid container spacing={2}>
        <SectionHeader
          title='Búsquedas de Clientes'
          subtitle='Listado de Búsquedas'
        />
        <Table columns={columns} state={tableStore} actions={actions}>
          <TableFilter placeholder='Buscar búsquedas...'>
            <Box className='flex gap-4 w-full'>
              <Button variant='outlined' size='small' onClick={() => tableStore.setFilters([])}>
                Limpiar filtros
              </Button>
              <Button
                key='update'
                startIcon={<RefreshIcon />}
                variant='contained'
                color='primary'
                onClick={() => fetchData()}
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

      {characteristicModalOpen && (
        <AddSearchCharacteristicModal
          open={characteristicModalOpen}
          onClose={handleCloseCharacteristicModal}
          searchId={selectedSearchId ?? null}
          onSuccess={handleCharacteristicAdded}
        />
      )}

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
    </>
  )
};

export default React.memo(SearchesTable);
