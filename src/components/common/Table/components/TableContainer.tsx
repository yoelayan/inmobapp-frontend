
import React from 'react'

import { TableContainer as MuiTableContainer, Table as MuiTable } from '@mui/material'

interface TableContainerProps {
  children: React.ReactNode
}

const TableContainer: React.FC<TableContainerProps> = ({ children }) => {
  return (
    <MuiTableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
      <MuiTable stickyHeader>{children}</MuiTable>
    </MuiTableContainer>
  )
}

export default TableContainer
