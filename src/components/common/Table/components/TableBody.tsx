
/**
 * TableBody Component with Mobile Column Priority Support
 *
 * This component implements a responsive table body that adapts to mobile screens by:
 * 1. Showing only priority columns in the main table view on mobile
 * 2. Moving lower priority columns to an expandable collapse area
 * 3. Providing full column visibility on desktop
 *
 * Column Priority Configuration:
 * Add 'meta.priority' to your column definition to control mobile display:
 *
 * Example:
 * ```
 * const columns = [
 *   {
 *     accessorKey: 'name',
 *     header: 'Nombre',
 *     meta: {
 *       priority: 10 // High priority - always show in mobile main view
 *     }
 *   },
 *   {
 *     accessorKey: 'email',
 *     header: 'Email',
 *     meta: {
 *       priority: 5 // Medium priority - show in collapse on mobile
 *     }
 *   },
 *   {
 *     accessorKey: 'notes',
 *     header: 'Notas',
 *     meta: {
 *       hideInMobile: true // Hide completely in mobile
 *     }
 *   }
 * ]
 * ```
 *
 * Usage:
 * ```
 * <TableBody priorityColumns={3} /> // Show top 3 priority columns in mobile
 * ```
 *
 * Priority Rules:
 * - Higher priority numbers = higher priority (10 > 5 > 1)
 * - Columns without priority default to 0
 * - First N columns (by priority) are shown in mobile main view
 * - Remaining columns are shown in the expandable collapse area
 * - Desktop view shows all columns regardless of priority
 */

import React, { useMemo, useState } from 'react'

import { TableBody as MuiTableBody, TableRow, TableCell, CircularProgress, Typography, Collapse, Box, useMediaQuery } from '@mui/material'

import { flexRender } from '@tanstack/react-table'

import { useTableContext } from '../TableContext'
import TableActions from './TableActions'

interface TableBodyProps {
  onRowClick?: (row: any) => void
  renderRow?: (row: any, actions?: React.ReactNode) => React.ReactNode
  renderActions?: (row: any) => React.ReactNode
  showActions?: boolean
  priorityColumns?: number // Number of priority columns to show in mobile (default: 3)
}

const TableBody = React.memo<TableBodyProps>(({
  onRowClick,
  renderRow,
  renderActions,
  showActions = true,
  priorityColumns = 3
}) => {
  const { table, state, actions } = useTableContext()
  const [openRow, setOpenRow] = useState<string | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleToggleRow = (rowId: string) => {
    setOpenRow(prev => (prev === rowId ? null : rowId))
  }

  const handleRowClick = (row: any) => {

    handleToggleRow(row.id)

    if (onRowClick) {
      onRowClick(row.original)
    }

  }

  // Separate columns into priority and non-priority for mobile
  const { priorityCells, nonPriorityCells } = useMemo(() => {
    if (!isMobile) {
      return { priorityCells: [], nonPriorityCells: [] }
    }

    const allColumns = table.getAllColumns()

    // Sort columns by priority (higher priority first), then by original order
    const sortedColumns = [...allColumns].sort((a, b) => {
      const priorityA = a.columnDef.meta?.priority || 0
      const priorityB = b.columnDef.meta?.priority || 0

      if (priorityA !== priorityB) {
        return priorityB - priorityA // Higher priority first
      }

      // If same priority, maintain original order
      return 0
    })

    // Filter out hidden columns
    const visibleColumns = sortedColumns.filter(col =>
      !col.columnDef.meta?.hideInMobile && col.getIsVisible()
    )

    // Take first N columns as priority
    const priorityColumnIds = visibleColumns.slice(0, priorityColumns).map(col => col.id)

    return {
      priorityCells: priorityColumnIds,
      nonPriorityCells: visibleColumns.slice(priorityColumns).map(col => col.id)
    }
  }, [table, isMobile, priorityColumns])

  // Extract rows to avoid complex expression in dependencies
  const tableRows = table.getRowModel().rows

  const renderedRows = useMemo(() => {
    return tableRows.map(row => {
      // Render actions component
      const actionsElement = (actions && showActions) ? (
        renderActions ?
          renderActions(row.original) :
          <TableActions row={row.original as Record<string, any>} actions={actions} />
      ) : null

      // Use custom renderRow if provided
      if (renderRow) {
        return renderRow(row, actionsElement)
      }

      // Default row rendering
      return (
        <React.Fragment key={row.id}>
          <TableRow
            hover
            onClick={onRowClick ? () => handleRowClick(row) : undefined}
            sx={onRowClick ? { cursor: 'pointer' } : {}}
          >

            {/* Main cells */}
            {row.getVisibleCells().map((cell, index) => {
              // In mobile, only show priority columns in main row
              if (isMobile && nonPriorityCells.includes(cell.column.id)) {
                return null
              }

              const visibleCells = row.getVisibleCells().filter(c =>
                !(isMobile && nonPriorityCells.includes(c.column.id))
              )

              const isLastCell = index === visibleCells.length - 1

              return (
                <TableCell
                  key={cell.id}
                  align='left'
                  sx={{
                    minWidth: { xs: '80px', md: '120px' },
                    width: isLastCell && !actions ? '100%' : 'auto',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    padding: { xs: '8px 4px', md: '16px' },
                    '&:first-of-type': {
                      paddingLeft: { xs: 1, md: 2 }
                    },
                    '&:last-child': {
                      paddingRight: { xs: 1, md: 2 }
                    }
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              )
            })}

            {actions && showActions && (
              <TableCell
                align='center'
                sx={{
                  width: 'auto',
                  whiteSpace: 'nowrap',
                  minWidth: { xs: '60px', md: '80px' },
                  paddingLeft: { xs: 0.5, md: 1 },
                  paddingRight: { xs: 0.5, md: 1 }
                }}
              >
                {actionsElement}
              </TableCell>
            )}
          </TableRow>

          {/* Collapsible details row - only show in mobile */}
          <TableRow sx={{ display: { xs: 'table-row', md: 'none' } }}>
            <TableCell
              colSpan={priorityCells.length + (actions && showActions ? 1 : 0)}
              sx={{ p: 0, border: 0, width: '100%' }}
            >
              <Collapse in={openRow === row.id} timeout='auto' unmountOnExit>
                <Box sx={{ m: 2, width: '100%' }}>
                  <Typography variant='body2' color='text.secondary' gutterBottom>
                    Detalles
                  </Typography>
                  {/* Show non-priority columns in collapse */}
                  {nonPriorityCells.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                      {row.getVisibleCells().map(cell => {
                        if (!nonPriorityCells.includes(cell.column.id)) {
                          return null
                        }

                        return (
                          <Box
                            key={cell.id}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              width: '100%',
                              minHeight: '24px'
                            }}
                          >
                            <Typography
                              variant='body2'
                              sx={{
                                fontWeight: 600,
                                minWidth: '100px',
                                maxWidth: '40%',
                                flexShrink: 0
                              }}
                            >
                              {cell.column.columnDef.header as string}:
                            </Typography>
                            <Typography
                              variant='body2'
                              sx={{
                                textAlign: 'right',
                                flex: 1,
                                ml: 1,
                                wordBreak: 'break-word'
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Typography>
                          </Box>
                        )
                      })}
                    </Box>
                  )}
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      )
    })
  }, [tableRows, renderRow, renderActions, onRowClick, actions, showActions, openRow, isMobile, priorityCells, nonPriorityCells])

  if (state.loading) {
    return (
      <MuiTableBody>
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length + (actions && showActions ? 1 : 0)} align='center' sx={{ py: 6 }}>
            <CircularProgress />
          </TableCell>
        </TableRow>
      </MuiTableBody>
    )
  }

  if (table.getRowModel().rows.length === 0) {
    return (
      <MuiTableBody>
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length + (actions && showActions ? 1 : 0)} align='center' sx={{ py: 6 }}>
            <Typography variant='body1'>No se encontraron datos</Typography>
          </TableCell>
        </TableRow>
      </MuiTableBody>
    )
  }

  return (
    <MuiTableBody>
      {renderedRows}
    </MuiTableBody>
  )
})

TableBody.displayName = 'TableBody'
export default TableBody

