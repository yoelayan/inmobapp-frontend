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
import useStates from '@/hooks/api/useStates'
import useFranchises from '@/hooks/api/useFranchises'
import useCities from '@/hooks/api/useCities'

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

  const { fetchData: getFranchises, refreshData: refreshFranchises, data: franchises } = useFranchises()


  const handleStateChange = async (StateSelected: Record<string, any>) => {
    console.log('e', StateSelected)

    if (!StateSelected || StateSelected.value === '') {
      return
    }

    setDefaultFiltersCities({ estado: StateSelected.value })

    if (refreshCities) {
      refreshCities({ estado: StateSelected.value })
    }
  }

  useEffect(() => {
    getStates()
    getCities()
    getFranchises()
  }, [])

  useEffect(() => {
    console.log('properties', properties)
  }, [properties])

  const grid_params: GridProps = {
    feature_image: 'first_image_url',
    title: 'nombre',
    subtitle: 'franquicia__nombre',
    feature_value: 'precio_usd',
    sub_feature_value: 'direccion',
    tags: [
      {
        label: 'Mt2',
        name: 'metros_cuadrados_terreno',
        icon: <SquareFootIcon fontSize='large' />
      },
      {
        label: 'Habt.',
        name: 'habitaciones',
        icon: <DoorFrontIcon fontSize='large' />
      },
      {
        label: 'Baños',
        name: 'numero_banios',
        icon: <BathtubIcon fontSize='large' />
      },
      {
        label: 'Est.',
        name: 'ptos_estacionamiento',
        icon: <DirectionsCarIcon fontSize='large' />
      }
    ]
  }

  const actions: TableAction[] = [
    {
      label: 'Ver',
      icon: <EyeIcon />,
      onClick: (row: Record<string, any>) => {
        console.log(row)
      }
    },
    {
      label: 'Editar',
      icon: <EditIcon />,
      onClick: (row: Record<string, any>) => {
        console.log('Editar', row)
        window.location.href = `/propiedades/actualizar/${row.id}`
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
      key: 'franquicia__nombre',
      label: 'Franquicia',
      filterable: true,
      slot: 'default',
      filter: 'select',
      filter_params: {
        response: franchises,
        dataMap: {
          value: 'id',
          label: 'nombre'
        },
        refreshData: refreshFranchises,
        searchble: true,
        filter_name: 'search'
      }
    },

    {
      key: 'nombre',
      label: 'Nombre',
      filterable: true,
      slot: 'default',
      filter_name: 'search'
    },
    {
      key: 'estado__nombre',
      filter_name: 'estado',
      label: 'Estado',
      filterable: true,
      filter: 'select',
      filter_params: {
        response: states,
        dataMap: {
          value: 'id',
          label: 'nombre'
        },
        refreshData: refreshStates,
        searchble: true,
        onChange: handleStateChange
      }
    },

    {
      key: 'ciudad__nombre',
      filter_name: 'ciudad',
      label: 'Ciudad',
      filterable: true,
      filter: 'select',
      filter_params: {
        response: cities,
        dataMap: {
          value: 'id',
          label: 'nombre'
        },
        refreshData: refreshCities,
        searchble: true
      }
    },
    { key: 'tipo_inmueble__descripcion', label: 'Tipo de Inmueble', filterable: false, slot: 'default' },
    { key: 'precio_usd', label: 'Precio (USD)', filterable: false, slot: 'default' },
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
