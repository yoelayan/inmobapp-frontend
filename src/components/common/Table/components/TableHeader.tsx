
import React, { useState } from 'react'

import { TableHead, TableRow, TableCell, Box, IconButton, Menu, MenuItem, ButtonGroup } from '@mui/material'
import { flexRender, type SortDirection } from '@tanstack/react-table'

import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import SortIcon from '@mui/icons-material/Sort'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

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

const TableHeader = React.memo(() => {
  const { table, actions } = useTableContext()

  return (
    <TableHead>
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <TableCell
              key={header.id}
              align='left'
              sx={{
                fontWeight: 'bold',
                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                userSelect: 'none',
                minWidth: '120px',
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
              <Box className='flex items-center justify-between'>
                {flexRender(header.column.columnDef.header, header.getContext())}
                <ButtonGroup className='flex items-center justify-between'>
                  {header.column.getCanSort() ? (
                    <Sort
                      isSorted={header.column.getIsSorted()}
                      handleClick={header.column.getToggleSortingHandler() as (event: unknown) => void}
                    />
                  ) : null}
                  {header.column.getCanFilter() && <Filter column={header.column} />}
                </ButtonGroup>
              </Box>
            </TableCell>
          ))}
          {actions && (
            <TableCell align='center' sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
              Acciones
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableHead>
  )
})

export default TableHeader
