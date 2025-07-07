"use client"

import React, { createContext, useContext, useEffect, useMemo } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'


import { rankItem } from '@tanstack/match-sorter-utils'

import type { ColumnDef, FilterFn, Table } from '@tanstack/react-table'

import type { TableState } from './types'


interface TableContextValue<T> {
  table: Table<T>
  state: TableState<T>
}

const TableContext = createContext<TableContextValue<any> | undefined>(undefined)

export function useTableContext<T>() {
  const context = useContext(TableContext)

  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider')
  }

  return context as TableContextValue<T>
}

interface TableProviderProps<T> {
  columns: ColumnDef<T>[]
  state: TableState<T>
  children: React.ReactNode
}



export function TableProvider<T>({ columns, state, children }: TableProviderProps<T>) {

  const CustomFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    if (Array.isArray(value)) {
      const [min, max] = value
      const rowValue = row.getValue(columnId)

      if (typeof rowValue === 'number') {
        if (min !== undefined && rowValue < min) return false
        if (max !== undefined && rowValue > max) return false
      }
    } else {
      const itemRank = rankItem(row.getValue(columnId), value)

      addMeta({ itemRank })

      return itemRank.passed
    }

    return true
  }

  // Crear instancia de la tabla con TanStack
  const table = useReactTable({
    data: state.data as T[],
    columns,
    filterFns: {
      fuzzy: CustomFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: state.totalPages,
    state: {
      pagination: {
        pageIndex: state.pageIndex,
        pageSize: state.pageSize
      },
      sorting: state.sorting
    },
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const { pageIndex, pageSize } = updater({
          pageIndex: state.pageIndex,
          pageSize: state.pageSize
        })

        state.setPageIndex(pageIndex)
        state.setPageSize(pageSize)
      }
    },
    onSortingChange: updater => {
      if (typeof updater === 'function') {
        state.setSorting(updater(state.sorting))
      } else {
        state.setSorting(updater)
      }
    }
  })

  // Efecto para cargar datos cuando cambian dependencias relevantes
  useEffect(() => {
    state.fetchData()
  }, [state.pageIndex, state.pageSize, state.filters, state.sorting])

  const contextValue = useMemo(
    () => ({
      table,
      state
    }),
    [table, state]
  )

  return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>
}
