
import React, { useState, useMemo } from 'react'

import { TableHead, TableRow, TableCell, Box, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material'
import { flexRender, type SortDirection } from '@tanstack/react-table'

import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import SortIcon from '@mui/icons-material/Sort'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import TrafficIcon from '@mui/icons-material/Traffic'

import { useTableContext } from '../TableContext'

import ColumnFilterDefault from '@/components/common/Table/filters/ColumnFilterDefault'

const Filter = ({ column }: { column: any }) => {
  // Toggle filter
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget.parentElement as HTMLDivElement)
    setIsOpen(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setIsOpen(false)
  }

  return (
    <>
      {!isOpen ? (
        <IconButton aria-label='Filtrar columna' onClick={handleClick} size='small'>
          <FilterListIcon />
        </IconButton>
      ): (
        <IconButton aria-label='Filtrar columna' onClick={handleClose} size='small'>
          <CloseIcon />
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem disableRipple>
          <ColumnFilterDefault column={column} />
        </MenuItem>
      </Menu>
    </>
  )
}

type SortProps = {
  isSorted: boolean | SortDirection
  handleClick: (event: unknown) => void | undefined
}

const Sort = ({ isSorted, handleClick }: SortProps) => {

  const sortDirection = isSorted ? (isSorted === 'asc' ? 'asc' : 'desc') : null

  return (
    <IconButton aria-label='Filtrar columna' onClick={handleClick} size='small'>
      {!isSorted ? (
        <SortIcon fontSize='small' sx={{ ml: 1 }} />
      ) : sortDirection === 'asc' ? (
        <ArrowUpwardIcon fontSize='small' sx={{ ml: 1 }} />
      ) : (
        <ArrowDownwardIcon fontSize='small' sx={{ ml: 1 }} />
      )}
    </IconButton>
  )
}

interface TableHeaderProps {
  priorityColumns?: number // Number of priority columns to show in mobile (default: 3)
}

const TableHeader = React.memo<TableHeaderProps>(({ priorityColumns = 3 }) => {
  const { table, actions } = useTableContext()
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Separate columns into priority and non-priority for mobile
  const { nonPriorityCells } = useMemo(() => {
    if (!isMobile) {
      return { nonPriorityCells: [] }
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

    // Take first N columns as priority, rest are non-priority
    const nonPriorityColumnIds = visibleColumns.slice(priorityColumns).map(col => col.id)

    return {
      nonPriorityCells: nonPriorityColumnIds
    }
  }, [table, isMobile, priorityColumns])

  return (
    <TableHead>
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id}>
          {/* Collapse icon header - only show in mobile */}


          {headerGroup.headers.map(header => {
            // In mobile, only show priority columns in main header
            if (isMobile && nonPriorityCells.includes(header.column.id)) {
              return null
            }

            return (
              <TableCell
                key={header.id}
                align='center'
                sx={{
                  fontWeight: 'bold',
                  cursor: header.column.getCanSort() ? 'pointer' : 'default',
                  userSelect: 'none',
                  minWidth: { xs: '80px', md: '120px' },
                  width: 'auto',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&:hover': header.column.getCanSort()
                    ? {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    : {}
                }}
              >
                {/* sort */}
                <Box className='flex gap-2 items-center justify-between' sx={{ width: '100%', padding: '0 12px' }}>
                  {header.column.getCanSort() ? (
                    <Sort
                      isSorted={header.column.getIsSorted()}
                      handleClick={header.column.getToggleSortingHandler() as (event: unknown) => void}
                    />
                  ) : <Box/>}
                  {flexRender(header.column.columnDef.header, header.getContext())}

                  {header.column.getCanFilter() ? <Filter column={header.column} /> : <Box/>}
                </Box>
              </TableCell>
            )
          })}

          {actions && (
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
              {/* si es mobile mostrar icono de semaforo */}
              {isMobile ? (
                <IconButton aria-label='Acciones' size='small'>
                  <TrafficIcon />
                </IconButton>
              ) : (
                'Acciones'
              )}
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableHead>
  )
})

TableHeader.displayName = 'TableHeader'
export default TableHeader
