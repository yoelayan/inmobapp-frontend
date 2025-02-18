'use client'

// React Imports
import React, { useEffect } from 'react'

// Component Imports
import GenericTable from '@/views/shared/list/GenericTable'
import type { 
  Header, TableAction
} from '@components/table/TableComponent'
import type { GridProps } from '@components/table/components/TableGrid'
import EyeIcon from '@mui/icons-material/RemoveRedEye'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

// Hooks Imports
import useClients from '@/hooks/api/crm/useClients'
import useFranchises from '@/hooks/api/realstate/useFranchises'
import { useRouter, useSearchParams } from 'next/navigation'

const Table: React.FC = () => {

  const router = useRouter()

  const { 
    data: franchises,
    fetchData: fetchFranchises,
    refreshData: refreshFranchises
  } = useFranchises()


  const grid_params: GridProps = {
    title: 'nombre',
    subtitle: 'status__nombre',
    feature_value: 'franquicia__usuario_asignado__full_name',
  }
  const actions: TableAction[] = [
    {
      label: 'Ver',
      icon: <EyeIcon />,
      onClick: (row: Record<string, any>) => {
        router.push('/clientes/agregar/')
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
    { key: 'nombre', label: 'Nombre', filterable: true, slot: 'default' },
    { key: 'email', label: 'Correo Electrónico', filterable: true, slot: 'default' },
    {
      key: 'franquicia__usuario_asignado__full_name',
      label: 'Usuario Asignado',
      filterable: false,
      slot: 'default'
    },
    { key: 'status__nombre', label: 'Estado', filterable: true, slot: 'default' },
    { key: 'created_at', label: 'Fecha de Creación', filterable: false, slot: 'default' }
  ]

  const { data, refreshData, fetchData } = useClients()

  useEffect(() => {
    fetchFranchises()
    fetchData()
  }, [fetchData])

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
