

import type { RowData } from '@tanstack/react-table'

import type { FilterItem, SortingItem } from '@/types/api/response'

// Interface for table actions
export interface TableAction {
  component?: React.ReactNode
  onClick?: (row: Record<string, any>) => void
  label?: string
  icon?: React.ReactNode
  disabled?: boolean | ((row: Record<string, any>) => boolean)
  tooltip?: string | ((row: Record<string, any>) => string | undefined)
  variant?: 'text' | 'outlined' | 'contained'
  size?: 'small' | 'medium' | 'large'
  className?: string
  style?: React.CSSProperties
  condition?: (row: Record<string, any>) => boolean
}

// Interface for column priority in mobile view


// Extend TanStack Table ColumnDef to include our custom meta
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface ColumnMeta<TData extends RowData, TValue> {
    priority?: number
    hideInMobile?: boolean
  }
}

// Render props interface for actions
export interface TableActionsRenderProps {
  row: Record<string, any>
  actions?: TableAction[]
}

export interface TableState<T> {
  data: T[]
  loading: boolean
  pageIndex: number
  pageSize: number
  totalCount: number
  totalPages: number
  filters: FilterItem[]
  sorting: SortingItem[]

  // Acciones
  setData: (data: T[]) => void
  setLoading: (loading: boolean) => void
  setPageIndex: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
  setTotalCount: (totalCount: number) => void
  setTotalPages: (totalPages: number) => void
  setFilters: (filters: FilterItem[]) => void
  addFilter: (filter: FilterItem) => void
  removeFilter: (field: string) => void
  setSorting: (sorting: SortingItem[]) => void
  addSorting: (sorting: SortingItem) => void
  fetchData: () => Promise<void>
}

// Type for the Zustand store hook
export type TableStore<T> = () => TableState<T>
