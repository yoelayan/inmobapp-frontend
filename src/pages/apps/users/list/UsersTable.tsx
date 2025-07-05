'use client'

// React Imports
import React, { useEffect } from 'react'

// Component Imports
import { useRouter } from 'next/navigation'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import GroupIcon from '@mui/icons-material/Group'

import GenericTable from '@/pages/shared/list/GenericTable'
import type { Header, TableAction } from '@/components/features/table/TableComponent'
import type { GridProps } from '@/components/features/table/components/TableGrid'

// Hooks Imports
import useUsers from '@/hooks/api/users/useUsers'
import useFranchises from '@/hooks/api/realstate/useFranchises'

const UsersTable: React.FC = () => {
  const router = useRouter()

  const { data: franchises, fetchData: fetchFranchises, refreshData: refreshFranchises } = useFranchises()

  const grid_params: GridProps = {
    title: 'name',
    subtitle: 'email',
    feature_value: 'group_names'
  }

  const actions: TableAction[] = [
    {
      label: 'Ver',
      icon: <VisibilityIcon />,
      onClick: (row: Record<string, any>) => {
        router.push(`/usuarios/${row.id}/ver/`)
      }
    },
    {
      label: 'Editar',
      icon: <EditIcon />,
      onClick: (row: Record<string, any>) => {
        router.push(`/usuarios/${row.id}/editar/`)
      }
    },
    {
      label: 'Gestionar Grupos',
      icon: <GroupIcon />,
      onClick: (row: Record<string, any>) => {
        router.push(`/usuarios/${row.id}/grupos/`)
      }
    },
    {
      label: 'Eliminar',
      icon: <DeleteIcon />,
      onClick: (row: Record<string, any>) => {
        console.log('Eliminar usuario', row)

        // TODO: Implementar confirmación y eliminación
      }
    }
  ]

  const headers: Header[] = [
    { key: 'name', label: 'Nombre', filterable: true, slot: 'default' },
    { key: 'email', label: 'Email', filterable: true, slot: 'default' },
    { key: 'group_names', label: 'Grupos', filterable: false, slot: 'default' },
    { key: 'is_active', label: 'Activo', filterable: true, slot: 'boolean' },
    { key: 'is_staff', label: 'Staff', filterable: true, slot: 'boolean' },
    { key: 'is_superuser', label: 'Superusuario', filterable: true, slot: 'boolean' },
    { key: 'date_joined', label: 'Fecha de Registro', filterable: false, slot: 'default' },
    { key: 'last_login', label: 'Último Acceso', filterable: false, slot: 'default' }
  ]

  const { data, refreshData, fetchData } = useUsers()

  useEffect(() => {
    fetchFranchises()
    fetchData()
  }, [fetchData, fetchFranchises])

  return (
    <GenericTable
      title='Usuarios'
      subtitle='Gestión de Usuarios del Sistema'
      hrefAddButton='usuarios/agregar/'
      headers={headers}
      response={data}
      refreshData={refreshData}
      grid_params={grid_params}
      actions={actions}
    />
  )
}

export default UsersTable
