import React from 'react'



// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'


import { useTableContext } from '../TableContext'

import CustomTextField from '@core/components/mui/TextField'

// Third Party Imports

const TablePaginationComponent = React.memo(() => {


  const { table, state } = useTableContext()


  const handleChangePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.setPageSize(Number(event.target.value))
  }

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>
        {`Mostrando ${
          state.totalCount === 0
            ? 0
            : (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1
        }
        a ${Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          state.totalCount
        )} de ${state.totalCount} entradas`}
      </Typography>
      <div className='flex items-center gap-2'>
        <Pagination
          shape='rounded'
          color='primary'
          variant='tonal'
          count={state.totalPages}
          page={table.getState().pagination.pageIndex + 1}
          onChange={(_, page) => {
            table.setPageIndex(page - 1)
          }}
          showFirstButton
          showLastButton
        />
        <CustomTextField
          select
          value={state.pageSize}
          onChange={handleChangePageSize}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </CustomTextField>
      </div>
    </div>
  )
})


export default TablePaginationComponent
