"use client"

import React, { useState, useCallback } from 'react'

import { Box, TextField, InputAdornment, IconButton, Toolbar, debounce } from '@mui/material'



import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

import { useTableContext } from '../TableContext'

interface TableFilterProps {
  placeholder?: string
  searchField?: string
  children?: React.ReactNode
}

const TableFilter: React.FC<TableFilterProps> = ({ placeholder = 'Buscar...', searchField = 'search', children }) => {
  const { state } = useTableContext()
  const [searchValue, setSearchValue] = useState('')

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value) {
        state.addFilter({ field: searchField, value })
      } else {
        state.removeFilter(searchField)
      }
    }, 300),
    [searchField, state.addFilter, state.removeFilter]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setSearchValue(value)
    debouncedSearch(value)
  }


  const clearSearch = () => {
    setSearchValue('')
    state.removeFilter(searchField)
  }

  return (
    <Toolbar
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <TextField
        variant='outlined'
        size='small'
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearchChange}
        sx={{ minWidth: 300 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchValue ? (
              <InputAdornment position='end'>
                <IconButton size='small' onClick={clearSearch} edge='end' aria-label='clear search'>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          }
        }}
      />

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{children}</Box>
    </Toolbar>
  )
}

export default TableFilter
