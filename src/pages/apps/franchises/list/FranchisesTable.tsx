'use client'

// React Imports
import React, { useEffect } from 'react'

// Component Imports
import { useRouter } from 'next/navigation'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'

import GenericTable from '@/pages/shared/list/GenericTable'
import type { Header, TableAction } from '@/components/features/table/TableComponent'
import type { GridProps } from '@/components/features/table/components/TableGrid'

// Hooks Imports
import useFranchises from '@/hooks/api/realstate/useFranchises'

const FranchisesTable: React.FC = () => {
  const router = useRouter()

  const grid_params: GridProps = {
    title: 'name',
    subtitle: 'franchise_type',
    feature_value: 'identifier'
  }

  const actions: TableAction[] = [
    {
      label: 'Ver',
      icon: <VisibilityIcon />,
      onClick: (row: Record<string, any>) => {
        router.push(`/franquicias/${row.id}/ver/`)
      }
    },
    {
      label: 'Editar',
      icon: <EditIcon />,
      onClick: (row: Record<string, any>) => {
        router.push(`/franquicias/${row.id}/editar/`)
      }
    },
    {
      label: 'Eliminar',
      icon: <DeleteIcon />,
      onClick: (row: Record<string, any>) => {
        console.log('Eliminar franquicia', row)

        // TODO: Implementar confirmación y eliminación
      }
    }
  ]

  const headers: Header[] = [
    { key: 'identifier', label: 'Identificador', filterable: true, slot: 'default' },
    { key: 'name', label: 'Nombre', filterable: true, slot: 'default' },
    {
      key: 'franchise_type',
      label: 'Tipo',
      filterable: true,
      slot: 'default',
      filter: 'select',
      filter_params: {
        options: [
          { value: 'COMMERCIAL', label: 'Comercial' },
          { value: 'PERSONAL', label: 'Personal' }
        ]
      }
    },
    { key: 'parent_name', label: 'Franquicia Padre', filterable: false, slot: 'default' },
    { key: 'is_active', label: 'Estado', filterable: true, slot: 'boolean' },
    { key: 'created_at', label: 'Fecha de Creación', filterable: false, slot: 'default' }
  ]

  const { data, refreshData, fetchData } = useFranchises()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <GenericTable
      title='Franquicias'
      subtitle='Gestión de Franquicias del Sistema'
      hrefAddButton='franquicias/agregar/'
      headers={headers}
      response={data}
      refreshData={refreshData}
      grid_params={grid_params}
      actions={actions}
    />
  )
}

export default FranchisesTable
