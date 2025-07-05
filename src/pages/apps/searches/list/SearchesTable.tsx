'use client'

// React Imports
import React, { useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import SearchIcon from '@mui/icons-material/Search'
import HistoryIcon from '@mui/icons-material/History'

// Component Imports
import GenericTable from '@/views/shared/list/GenericTable'
import type { Header, TableAction } from '@components/table/TableComponent'
import type { GridProps } from '@components/table/components/TableGrid'
import AddSearchCharacteristicModal from '../form/AddSearchCharacteristicModal'
import AddSearchObservationModal from '../form/AddSearchObservationModal'
import ObservationsLogModal from '../form/ObservationsLogModal'

// Hooks Imports
import useSearches from '@/hooks/api/crm/useSearches'

import { useNotification } from '@/hooks/useNotification'

const SearchesTable: React.FC = () => {
  const router = useRouter()
  const { notify } = useNotification()
  const [characteristicModalOpen, setCharacteristicModalOpen] = useState(false)
  const [observationModalOpen, setObservationModalOpen] = useState(false)
  const [observationsLogModalOpen, setObservationsLogModalOpen] = useState(false)
  const [selectedSearchId, setSelectedSearchId] = useState<string>('')
  const [selectedSearch, setSelectedSearch] = useState<any>(null)

  const handleOpenCharacteristicModal = (searchId: string) => {
    setSelectedSearchId(searchId)
    setCharacteristicModalOpen(true)
  }

  const handleCloseCharacteristicModal = () => {
    setCharacteristicModalOpen(false)
  }

  const handleOpenObservationModal = (searchId: string) => {
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

  const grid_params: GridProps = {
    title: 'client__name',
    subtitle: 'description',
    feature_value: 'budget'
  }

  const actions: TableAction[] = [
    {
      label: 'Añadir Característica',
      icon: <AddCircleOutlineIcon />,
      onClick: (row: Record<string, any>) => {
        handleOpenCharacteristicModal(row.id)
      }
    },
    {
      label: 'Añadir Observación',
      icon: <AddCircleOutlineIcon />,
      onClick: (row: Record<string, any>) => {
        handleOpenObservationModal(row.id)
      }
    },
    {
      label: 'Ver Bitácora',
      icon: <HistoryIcon />,
      onClick: (row: Record<string, any>) => {
        handleOpenObservationsLogModal(row)
      }
    },
    {
      label: 'Ver Coincidencias',
      icon: <SearchIcon />,
      onClick: (row: Record<string, any>) => {
        router.push(`/clientes/${row.id}/coincidencias`)
      }
    },
    {
      label: 'Editar',
      icon: <EditIcon />,
      onClick: (row: Record<string, any>) => {
        console.log('Editar', row)
        router.push(`/clientes/search/${row.id}/`)
      }
    },
    {
      label: 'Eliminar',
      icon: <DeleteIcon />,
      onClick: (row: Record<string, any>) => {
        console.log('Eliminar', row)
      }
    }
  ]

  const { data, refreshData, fetchData } = useSearches()

  const headers: Header[] = [
    { key: 'client__name', label: 'Nombre', filterable: true, slot: 'default' },
    { key: 'description', label: 'Descripción', filterable: true, slot: 'default' },
    { key: 'budget', label: 'Presupuesto', filterable: true, slot: 'default' },
    {
      key: 'characteristics',
      label: 'Características',
      filterable: false,
      slot: 'characteristics',
      slot_params: {
        allowDelete: true,
        onDelete: handleSearchDeleted
      }
    }
  ]

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <GenericTable
        title='Búsquedas de Clientes'
        subtitle='Listado de Búsquedas'
        hrefAddButton='/clientes/busquedas/agregar'
        headers={headers}
        response={data}
        refreshData={refreshData}
        grid_params={grid_params}
        actions={actions}
      />

      {characteristicModalOpen && (
        <AddSearchCharacteristicModal
          open={characteristicModalOpen}
          onClose={handleCloseCharacteristicModal}
          searchId={selectedSearchId}
          onSuccess={handleCharacteristicAdded}
        />
      )}

      {observationModalOpen && (
        <AddSearchObservationModal
          open={observationModalOpen}
          onClose={handleCloseObservationModal}
          searchId={selectedSearchId}
          onSuccess={handleObservationAdded}
        />
      )}

      {observationsLogModalOpen && selectedSearch && (
        <ObservationsLogModal
          open={observationsLogModalOpen}
          onClose={handleCloseObservationsLogModal}
          searchId={selectedSearchId}
          observations={selectedSearch.observations || []}
          onSuccess={handleObservationsLogAdded}
        />
      )}
    </>
  )
}

export default SearchesTable
