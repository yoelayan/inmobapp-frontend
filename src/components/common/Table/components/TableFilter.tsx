"use client"

import React, { useState } from 'react'

import { useDebounce } from 'react-use'

import {
  useMediaQuery,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Toolbar,
  Modal,
  Button,
  Card,
  CardHeader,
  CardContent
} from '@mui/material'

import SettingsIcon from '@mui/icons-material/Settings'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

import { useTableContext } from '../TableContext'

interface TableFilterProps {
  placeholder?: string
  searchField?: string
  children?: React.ReactNode
  className?: string
}

const TableFilter: React.FC<TableFilterProps> = ({ placeholder = 'Buscar...', searchField = 'search', children, className}) => {
  const { state } = useTableContext()
  const [searchValue, setSearchValue] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 600px)')

  // useDebounce ejecuta la función después de 2 segundos de que searchValue deje de cambiar
  useDebounce(
    () => {
      if (searchValue.trim()) {
        state.addFilter({ field: searchField, value: searchValue.trim() })
      } else {
        state.removeFilter(searchField)
      }
    },
    2000, // 2 segundos
    [searchValue]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    setSearchValue(value)
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
        gap: 2,
        ...(className && { className })
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

      {!isMobile && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {children}
        </Box>
      )}
      {isMobile && (
        <>
          <Button className="w-full" variant='contained' color='primary' onClick={() => setIsModalOpen(true)} startIcon={<SettingsIcon />}>
            Opciones
          </Button>
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Card className="table-filter-modal" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '600px',
              padding: 0,
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}>
              <CardHeader
                className="table-filter-modal-header"
                title={<span className="font-semibold text-lg">Opciones</span>}
                action={
                  <IconButton onClick={() => setIsModalOpen(false)} size="small" aria-label="Cerrar">
                    <ClearIcon />
                  </IconButton>
                }
                style={{
                  borderBottom: '1px solid #e0e0e0',
                  background: 'var(--mui-palette-background-default, #fff)',
                  padding: 16
                }}
              />
              <CardContent
                className="table-filter-modal-content flex flex-col gap-4"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  padding: 24
                }}
              >
                {children}
              </CardContent>
            </Card>
          </Modal>
        </>
      )}
    </Toolbar>
  )
}

export default TableFilter
