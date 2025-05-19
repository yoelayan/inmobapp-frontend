'use client'

// React Imports
import React, { useEffect } from 'react'

// Component Imports
import { useRouter } from 'next/navigation'

import EditIcon from '@mui/icons-material/Edit'

import DeleteIcon from '@mui/icons-material/Delete'

import GenericTable from '@/views/shared/list/GenericTable'
import type { Header, TableAction } from '@components/table/TableComponent'

import type { GridProps } from '@components/table/components/TableGrid'

// Hooks Imports
import useClients from '@/hooks/api/crm/useClients'

import useFranchises from '@/hooks/api/realstate/useFranchises'

const Table: React.FC = () => {
  const router = useRouter()

  const { data: franchises, fetchData: fetchFranchises, refreshData: refreshFranchises } = useFranchises()

  const grid_params: GridProps = {
    title: 'name',
    subtitle: 'status__name',
    feature_value: 'assigned_to_name'
  }

  const actions: TableAction[] = [
    {
      label: 'Editar',
      icon: <EditIcon />,
      onClick: (row: Record<string, any>) => {
        console.log('Editar', row)
        router.push(`/clientes/${row.id}/`)
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
      key: 'franchise_name',
      label: 'Franquicia',
      filterable: true,
      slot: 'default',
      filter: 'select',
      filter_params: {
        response: franchises,
        dataMap: {
          value: 'id',
          label: 'name'
        },
        refreshData: refreshFranchises,
        searchble: true,
        filter_name: 'search'
      }
    },
    { key: 'name', label: 'Nombre', filterable: true, slot: 'default' },
    { key: 'email', label: 'Correo Electrónico', filterable: true, slot: 'default' },
    {
      key: 'assigned_to_name',
      label: 'Usuario Asignado',
      filterable: false,
      slot: 'default'
    },
    { key: 'status_name', label: 'Estado', filterable: true, slot: 'default' },
    { key: 'formated_created_at', label: 'Fecha de Creación', filterable: false, slot: 'default' }
  ]

  const { data, refreshData, fetchData } = useClients()

  useEffect(() => {
    fetchFranchises()
    fetchData()
  }, [fetchData, fetchFranchises])

  return (
    <GenericTable
      title='Clientes'
      subtitle='Listado de Clientes'
      hrefAddButton='clientes/agregar/'
      headers={headers}
      response={data}
      refreshData={refreshData}
      grid_params={grid_params}
      actions={actions}
    />
  )
}

export default Table
