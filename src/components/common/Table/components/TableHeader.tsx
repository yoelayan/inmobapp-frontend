// components/TableHeader.tsx
import React from 'react'

import { TableHead, TableRow, TableCell, Box } from '@mui/material'
import { flexRender } from '@tanstack/react-table'


import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'


import { useTableContext } from '../TableContext'

const TableHeader = () => {
  const { table } = useTableContext()

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
                '&:hover': header.column.getCanSort()
                  ? {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  : {}
              }}
              onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getIsSorted() === 'asc' && <ArrowUpwardIcon fontSize='small' sx={{ ml: 1 }} />}
                {header.column.getIsSorted() === 'desc' && <ArrowDownwardIcon fontSize='small' sx={{ ml: 1 }} />}
              </Box>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableHead>
  )
}

export default TableHeader
