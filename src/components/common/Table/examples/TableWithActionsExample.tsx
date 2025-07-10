// Example usage of Table with Actions
import React from 'react'
import { IconButton, Chip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ArchiveIcon from '@mui/icons-material/Archive'

import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TablePagination,
  createTableStore
} from '../index'
import type { TableAction } from '../types'

// Example component showing different ways to use actions
const TableWithActionsExample = () => {
  // Create table store (assuming you have this implemented)
  const tableState = createTableStore()

  // Example columns definition
  const columns = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }: any) => (
        <Chip
          label={row.original.status}
          color={row.original.status === 'active' ? 'success' : 'default'}
          size="small"
        />
      )
    },
  ]

  // Example 1: Basic actions configuration
  const basicActions: TableAction[] = [
    {
      label: 'Ver',
      icon: <VisibilityIcon fontSize="small" />,
      onClick: (row) => {
        console.log('Viewing:', row)
      }
    },
    {
      label: 'Editar',
      icon: <EditIcon fontSize="small" />,
      onClick: (row) => {
        console.log('Editing:', row)
      },
      // Conditional action - only show for active users
      condition: (row) => row.status === 'active'
    },
    {
      label: 'Eliminar',
      icon: <DeleteIcon fontSize="small" />,
      onClick: (row) => {
        console.log('Deleting:', row)
      },
      // Dynamic disabled state
      disabled: (row) => row.status === 'inactive',
      style: { color: 'error.main' }
    }
  ]

  // Example 2: Custom actions render function
  const renderCustomActions = (row: any) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton
        size="small"
        onClick={() => console.log('Custom edit:', row)}
        disabled={row.status === 'inactive'}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => console.log('Custom archive:', row)}
      >
        <ArchiveIcon fontSize="small" />
      </IconButton>
    </div>
  )

  // Example 3: Custom row render with actions
  const renderCustomRow = (row: any, actionsElement: React.ReactNode) => (
    <tr key={row.id} className="hover:bg-gray-50">
      {row.getVisibleCells().map((cell: any) => (
        <td key={cell.id} className="px-4 py-2">
          {cell.render('Cell')}
        </td>
      ))}
      <td className="px-4 py-2 text-center">
        {actionsElement}
      </td>
    </tr>
  )

  return (
    <div className="space-y-8">
      {/* Example 1: Basic Table with Default Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. Tabla Básica con Acciones</h3>
        <Table
          columns={columns}
          state={tableState}
          actions={basicActions}
        >
          <TableContainer>
            <TableHeader />
            <TableBody />
          </TableContainer>
          <TablePagination />
        </Table>
      </div>

      {/* Example 2: Table with Custom Actions Render */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2. Tabla con Acciones Personalizadas</h3>
        <Table
          columns={columns}
          state={tableState}
          actions={basicActions} // We still provide actions for context
        >
          <TableContainer>
            <TableHeader actionsLabel="Opciones" />
            <TableBody
              renderActions={renderCustomActions}
            />
          </TableContainer>
          <TablePagination />
        </Table>
      </div>

      {/* Example 3: Table with Custom Row Render */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3. Tabla con Renderizado Personalizado</h3>
        <Table
          columns={columns}
          state={tableState}
          actions={basicActions}
        >
          <TableContainer>
            <TableHeader />
            <TableBody
              renderRow={renderCustomRow}
            />
          </TableContainer>
          <TablePagination />
        </Table>
      </div>

      {/* Example 4: Table without Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">4. Tabla sin Acciones</h3>
        <Table
          columns={columns}
          state={tableState}
        >
          <TableContainer>
            <TableHeader />
            <TableBody showActions={false} />
          </TableContainer>
          <TablePagination />
        </Table>
      </div>
    </div>
  )
}

export default TableWithActionsExample
