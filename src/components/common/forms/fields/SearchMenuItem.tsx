import React, { useState, useCallback } from 'react'

import { MenuItem, CircularProgress, Typography } from '@mui/material'

import debounce from '@/utils/debounce'

import type { AsyncLoadFunction, AsyncSelectOption } from '@/types/common/forms.types'

interface SearchMenuItemProps {
  refreshData: AsyncLoadFunction
  minSearchLength?: number
  debounceTime?: number
  searchPlaceholder?: string
  onSearchResults?: (results: AsyncSelectOption[]) => void
  onSearchStart?: () => void
  loading?: boolean
}

export const SearchMenuItem: React.FC<SearchMenuItemProps> = ({
  refreshData,
  minSearchLength = 2,
  debounceTime = 300,
  searchPlaceholder = 'Buscar...',
  onSearchResults,
  onSearchStart,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Crear función para la búsqueda
  const performSearch = useCallback(async (term: string) => {
    if (term.length >= minSearchLength) {
      setIsSearching(true)

      try {
        const response = await refreshData({
          page: 1,
          pageSize: 50,
          filters: [{ field: 'search', value: term }],
          sorting: []
        })

        // Si hay callback para manejar resultados, lo llamamos
        if (onSearchResults && response?.results) {
          const options: AsyncSelectOption[] = response.results.map((item: any) => ({
            value: item.id,
            label: item.name || item.title || item.label || String(item.id)
          }))

          onSearchResults(options)
        }
      } catch (error) {
        console.error('Error en la búsqueda:', error)
      } finally {
        setIsSearching(false)
      }
    }
  }, [refreshData, minSearchLength, onSearchResults])

  // Crear función debounced para la búsqueda
  const debouncedSearch = useCallback(
    (() => debounce(performSearch, debounceTime))(),
    [performSearch, debounceTime]
  )

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setSearchTerm(value)

    if (value.length >= minSearchLength) {
      // Notificar que se inicia la búsqueda
      if (onSearchStart) {
        onSearchStart()
      }

      debouncedSearch(value)
    } else {
      // Limpiar resultados si no cumple la longitud mínima
      if (onSearchResults) {
        onSearchResults([])
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Prevenir que el evento se propague al Autocomplete
    event.stopPropagation()
  }

  return (
    <MenuItem
      className="border-b border-gray-200 hover:bg-transparent cursor-default"
      disableRipple
    >
      <div className="w-full relative">


        {(isSearching || loading) && (
          <CircularProgress
            size={16}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          />
        )}

        {searchTerm.length > 0 && searchTerm.length < minSearchLength && (
          <Typography
            variant="caption"
            className="block mt-2 text-gray-500 text-xs"
          >
            Escribe al menos {minSearchLength} caracteres para buscar
          </Typography>
        )}
      </div>
    </MenuItem>
  )
}
