'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// Mui Imports
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import DoorFrontIcon from '@mui/icons-material/DoorFront'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import BathtubIcon from '@mui/icons-material/Bathtub'
import EyeIcon from '@mui/icons-material/RemoveRedEye'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

// Hooks
import useStates from '@/hooks/api/locations/useStates'
import useUsersByFranchise from '@/hooks/api/realstate/useUsersByFranchise'
import useCities from '@/hooks/api/locations/useCities'
import { useRouter, useSearchParams } from 'next/navigation'

// Table Component
import type { Header, TableAction } from '@components/table/TableComponent'
import type { GridProps } from '@components/table/components/TableGrid'
import GenericTable from '@/views/shared/list/GenericTable'

interface TableProps {
  properties: any
  refreshProperties: (filters?: Record<string, any>) => Promise<void>
}

const Table = ({ properties, refreshProperties }: TableProps) => {
  const [defaultFiltersCities, setDefaultFiltersCities] = useState<any>({})

  const { fetchData: getStates, refreshData: refreshStates, data: states } = useStates()

  const { fetchData: getCities, refreshData: refreshCities, data: cities } = useCities(defaultFiltersCities)

  const { fetchData: getUsers, refreshData: refreshUsers, data: users } = useUsersByFranchise()

  const router = useRouter()

  const handleStateChange = async (StateSelected: Record<string, any>) => {

    if (!StateSelected || StateSelected.value === '') {
      return
    }

    setDefaultFiltersCities({ state: StateSelected.value })

    if (refreshCities) {
      refreshCities({ state: StateSelected.value })
    }
  }

  const searchOnTag = (tag: any, row: any) => {
    if (row.characteristics === null || row.characteristics.length === 0) return null

    const value = row.characteristics.find((item: any) => item.code === tag.name)

    return value ? value.value : null
    
  }

  useEffect(() => {
    getStates()
    getCities()
    getUsers()
  }, [])

  const grid_params: GridProps = {
    feature_image: 'first_image_url',
    title: 'name',
    subtitle: 'assigned_to__email',
    feature_value: 'price',
    sub_feature_value: 'address',
    tags: [
      {
        label: 'Mt2',
        name: 'age',
        icon: <SquareFootIcon fontSize='large' />,
        searchOn: searchOnTag
      },
      {
        label: 'Habt.',
        name: 'rooms',
        icon: <DoorFrontIcon fontSize='large' />,
        searchOn: searchOnTag
      },
      {
        label: 'Baños',
        name: 'bathrooms',
        icon: <BathtubIcon fontSize='large' />,
        searchOn: searchOnTag
      },
      {
        label: 'Est.',
        name: 'parking_spaces',
        icon: <DirectionsCarIcon fontSize='large' />,
        searchOn: searchOnTag
      }
    ]
  }

  const actions: TableAction[] = [
    {
      label: 'Ver / Editar',
      icon: <><EyeIcon /><EditIcon /></>,
      onClick: (row: Record<string, any>) => {
        router.push(`/propiedades/actualizar/${row.id}`)
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

  const headers: Header[] = [
    {
      key: 'assigned_to__email',
      label: 'Asignado a',
      filterable: true,
      slot: 'default',
      filter: 'select',
      filter_name: 'assigned_to',
      filter_params: {
        response: users,
        dataMap: {
          value: 'id',
          label: 'email'
        },
        refreshData: refreshUsers,
        searchble: true,
        filter_name: 'search'
      }
    },

    {
      key: 'name',
      label: 'Nombre',
      filterable: true,
      slot: 'default',
      filter_name: 'search'
    },
    {
      key: 'state__name',
      filter_name: 'state',
      label: 'Estado',
      filterable: true,
      filter: 'select',
      filter_params: {
        response: states,
        dataMap: {
          value: 'id',
          label: 'name'
        },
        refreshData: refreshStates,
        searchble: true,
        onChange: handleStateChange
      }
    },

    {
      key: 'city__name',
      filter_name: 'city',
      label: 'Ciudad',
      filterable: true,
      filter: 'select',
      filter_params: {
        response: cities,
        dataMap: {
          value: 'id',
          label: 'name'
        },
        refreshData: refreshCities,
        searchble: true
      }
    },
    { key: 'type_negotiation__name', label: 'Tipo de Inmueble', filterable: false, slot: 'default' },
    { key: 'price', label: 'Precio (USD)', filterable: false, slot: 'default' },
    { key: 'created_at', label: 'Fecha de Creación', filterable: false, slot: 'default' }
  ]

  return (
    <GenericTable
      title='Propiedades'
      subtitle='Aquí puedes ver todas las propiedades disponibles'
      hrefAddButton='/propiedades/agregar'
      headers={headers}
      response={properties}
      refreshData={refreshProperties}
      grid_params={grid_params}
      actions={actions}
    />
  )
}

export default Table
