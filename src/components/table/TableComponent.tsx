/**
 * TableComponent is a React functional component that renders a table with various features
 * such as filtering, sorting, pagination, and custom cell rendering based on provided headers.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.showAddButton - Flag to show or hide the "Add" button.
 * @param {boolean} props.showGeneralFilters - Flag to show or hide general filters.
 * @param {Header[]} props.headers - Array of header objects defining the table columns.
 * @param {any[]} props.data - Array of data objects to be displayed in the table.
 *
 * @typedef {Object} Header
 * @property {string} key - The key of the header.
 * @property {string} label - The label of the header.
 * @property {boolean} filterable - Flag to indicate if the column is filterable.
 * @property {string} slot - The slot type for custom cell rendering.
 *
 * @returns {JSX.Element} The rendered table component.
 */
import React, { useEffect, useState, useMemo } from 'react'

// Tanstack Table imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { ColumnFiltersState, FilterFn } from '@tanstack/react-table'

// Mui Imports
import {
  TablePagination,
  Button,
  Card,
  CardHeader,
  Divider,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  Menu
} from '@mui/material'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'

import classnames from 'classnames'

// Components imports
import TableActions from './components/TableActions'
import TableGrid from './components/TableGrid'
import TableCollapsible from './components/TableCollapsible'

import TableFilters from './TableFilters'
import TablePaginationComponent from './TablePaginationComponent'
import DefaultSlot from './slots/DefaultSlot'
import BooleanSlot from './slots/BooleanSlot'
import CharacteristicsSlot from './slots/CharacteristicsSlot'
import DebouncedInput from './components/DebouncedInput'

import ColumnFilterSelect from './filters/ColumnFilterSelect'
import ColumnFilterDefault from './filters/ColumnFilterDefault'

// Styles
import tableStyles from '@core/styles/table.module.css'

// Types

import type { ResponseAPI } from '@/api/repositories/BaseRepository'
import type { GridProps } from './components/TableGrid'

export interface Header {
  key: string
  label: string
  filterable: boolean
  slot?: string
  filter_name?: string
  filter?: string
  filter_params?: Record<string, any>
  conditional_slot?: {
    condition_key: string
    condition_value: string
    slot: string
  }
  slot_params?: Record<string, any>
}
export interface TableAction {
  component?: React.ReactNode
  onClick?: (row: Record<string, any>) => void
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
  tooltip?: string
  variant?: 'text' | 'outlined' | 'contained'
  size?: 'small' | 'medium' | 'large'
  className?: string
  style?: React.CSSProperties
}
interface TableComponentProps {
  showGeneralFilters: boolean
  headers: Header[]
  response: ResponseAPI<any> | null
  customButtons?: React.ReactNode[]
  refreshData: (filters?: Record<string, any>) => Promise<void>
  grid_params?: GridProps
  actions?: TableAction[]
}

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

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

const extractProperties = (data: any[], headers: Header[], grid_params?: GridProps) => {
  const allKeys = new Set<string>()
  const definedKeys = new Set<string>()

  // Collect keys from headers
  headers.forEach(header => {
    allKeys.add(header.key)
    definedKeys.add(header.key)
  })

  // Collect keys from grid_params
  if (grid_params) {
    Object.values(grid_params).forEach(value => {
      if (typeof value === 'string') {
        allKeys.add(value)
      }
    })

    if (grid_params.tags) {
      grid_params.tags.forEach(tag => {
        allKeys.add(tag.name)
      })
    }
  }

  // Collect all keys from data objects
  data.forEach(item => {
    const keys = Object.keys(item)

    keys.forEach(key => {
      allKeys.add(key)
    })
  })

  // add id to keys
  allKeys.add('id')

  return (data || []).map(item => {
    const filteredItem: { [key: string]: any } = {}

    Array.from(allKeys).forEach(key => {
      const value = key.split('__').reduce((acc, part) => {
        if (acc && typeof acc === 'object') {
          return acc[part]
        } else {
          return undefined
        }
      }, item)

      filteredItem[key] = value !== undefined ? value : ''
    })

    return filteredItem
  })
}

const slotComponents: { [key: string]: React.FC<{ value: any }> } = {
  default: DefaultSlot,
  number: DefaultSlot,
  boolean: BooleanSlot,
  characteristics: CharacteristicsSlot
}

const FilterComponents: { [key: string]: any } = {
  default: ColumnFilterDefault,
  select: ColumnFilterSelect
}

const TableComponent: React.FC<TableComponentProps> = ({
  showGeneralFilters,
  headers,
  response,
  customButtons,
  refreshData,
  grid_params,
  actions
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isGridView, setIsGridView] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [columnVisibility, setColumnVisibility] = useState({})
  const isMobile = useMediaQuery('(max-width: 768px)')

  const toggleView = () => setIsGridView(!isGridView)
  const columnHelper = createColumnHelper<any>()

  /**
   * Generates the columns for the table based on the provided headers.
   *
   * @returns {Column[]} An array of column objects for the table.
   */
  const columns = useMemo(
    () =>
      headers.map(header => {
        const SlotComponent = slotComponents[header.slot || 'default']

        const filterName = header.filter_name || header.key

        return columnHelper.accessor(filterName, {
          header: header.label,
          cell: SlotComponent
            ? ({ row }) => <SlotComponent value={row.original[header.key]} {...header.slot_params} />
            : header.key,

          enableColumnFilter: header.filterable,
          meta: {
            filter: header.filter,
            filter_params: header.filter_params,
            label: header.label
          }
        })
      }),
    [headers]
  )

  useEffect(() => {
    if (!response || !response?.results) return

    const results = extractProperties(response.results, headers, grid_params)

    setFilteredData(results)
  }, [headers, response])

  const filteredDataMemo = useMemo(() => {
    if (!globalFilter) {
      return filteredData
    }

    const lowerCaseFilter = globalFilter.toLowerCase()

    return filteredData.filter(row => {
      return Object.values(row).some(value => {
        if (value == null) return false

        return String(value).toLowerCase().includes(lowerCaseFilter)
      })
    })
  }, [globalFilter, filteredData])

  const getData = () => {
    let filters = {}

    columnFilters.forEach(filter => {
      filters = { ...filters, [filter.id]: filter.value }
    })
    refreshData(filters)
  }

  const table = useReactTable({
    data: filteredDataMemo,
    columns,
    filterFns: {
      fuzzy: CustomFilter
    },
    manualFiltering: true,
    state: {
      globalFilter,
      columnFilters,
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const renderFilter = (column: any) => {
    const FilterComponent = FilterComponents[column.columnDef.meta.filter || 'default']

    return <FilterComponent column={column} table={table} {...column.columnDef.meta.filter_params} />
  }

  return (
    <>
      <Card>
        {showGeneralFilters && (
          <>
            <CardHeader title='Filtros' />
            <TableFilters />
          </>
        )}
        <Divider />
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Buscar'
            className='max-sm:is-full'
          />

          <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
            <ToggleButtonGroup
              value={isGridView}
              exclusive
              onChange={toggleView}
              aria-label='view'
              className='max-sm:is-full is-auto'
            >
              <ToggleButton className='max-sm:is-full is-auto' value={false} aria-label='list'>
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton className='max-sm:is-full is-auto' value={true} aria-label='grid'>
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant='contained'
              className='max-sm:is-full is-auto'
              onClick={() => {
                table.resetColumnFilters()
                table.resetGlobalFilter()
              }}
            >
              {' '}
              Limpiar selección
            </Button>
            {customButtons &&
              customButtons.map((button, index) => (
                <div className='max-sm:is-full is-auto' key={index}>
                  {button}
                </div>
              ))}
            <Button className='max-sm:is-full is-auto' key='refresh' variant='contained' onClick={getData}>
              <i className='tabler-search text-xl' />
            </Button>
            <Button
              id='columns-visibility-button'
              className='max-sm:is-full is-auto'
              variant='contained'
              aria-controls={open ? 'columns-visibility-button' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <i className='tabler-columns text-xl' />
            </Button>
            <Menu
              id='columns-visibility-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'columns-visibility-menu',
                role: 'listbox'
              }}
            >
              {table.getAllLeafColumns().map(column => (
                <MenuItem key={column.id} value={column.id} onClick={() => column.toggleVisibility()}>
                  <input type='checkbox' checked={column.getIsVisible()} />
                  {(column.columnDef.meta as { label: string }).label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>

        {isGridView ? (
          <TableGrid
            table={table}
            headers={headers}
            grid_params={grid_params}
            actions={actions}
            renderFilter={renderFilter}
          />
        ) : isMobile ? (
          <div className='overflow-x-auto'>
            <TableCollapsible
              headers={headers}
              data={table.getRowModel().rows.map(row => row.original)}
              actions={actions}
            />
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              className={classnames({
                                'flex items-center': header.column.getIsSorted(),
                                'cursor-pointer select-none': header.column.getCanSort()
                              })}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: <i className='tabler-chevron-up text-xl' />,
                                desc: <i className='tabler-chevron-down text-xl' />
                              }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                            </div>
                            {header.column.getCanFilter() && renderFilter(header.column)}
                          </>
                        )}
                      </th>
                    ))}
                    {actions && <th>Acciones</th>}
                  </tr>
                ))}
              </thead>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      Sin información disponible
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} data-label={cell.column.columnDef.header}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                      {actions && (
                        <td colSpan={table.getVisibleFlatColumns().length}>
                          {<TableActions row={row.original} actions={actions} />}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}

        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
    </>
  )
}

export default TableComponent
