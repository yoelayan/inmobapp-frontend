// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from '@core/components/mui/TextField'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'

const TablePaginationComponent = ({ table }: { table: ReturnType<typeof useReactTable> }) => {
  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>
        {`Mostrando ${
          table.getFilteredRowModel().rows.length === 0
            ? 0
            : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
        }
        a ${Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )} de ${table.getFilteredRowModel().rows.length} entradas`}
      </Typography>
      <div className='flex items-center gap-2'>

        <Pagination
          shape='rounded'
          color='primary'
          variant='tonal'
          count={Math.ceil(table.getFilteredRowModel().rows.length / table.getState().pagination.pageSize)}
          page={table.getState().pagination.pageIndex + 1}
          onChange={(_, page) => {
            table.setPageIndex(page - 1)
          }}
          showFirstButton
          showLastButton
        />
        <CustomTextField
          select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          <MenuItem value='10'>10</MenuItem>
          <MenuItem value='25'>25</MenuItem>
          <MenuItem value='50'>50</MenuItem>
        </CustomTextField>
      </div>

    </div>
  )
}

export default TablePaginationComponent
