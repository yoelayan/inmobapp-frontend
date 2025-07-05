'use client'

// React Imports
import React from 'react'

// Server Imports
import Button from '@mui/material/Button'

import type { ResponseAPI } from '@/api/repositories/BaseRepository'

// Component Imports
import type { Header, TableAction } from '@components/table/TableComponent'
import type { GridProps } from '@components/table/components/TableGrid'
import TableComponent from '@components/table/TableComponent'
import SectionHeader from '@components/layout/horizontal/SectionHeader'

// Button Imports
import Link from '@/components/Link'

interface GenericTableProps<T> {
  title: string
  subtitle: string
  headers: Header[]
  response: ResponseAPI<T> | T | null
  customButtons?: React.ReactNode[]
  hrefAddButton?: string
  refreshData: (filters?: Record<string, any>) => Promise<void>
  grid_params?: GridProps
  actions?: TableAction[]
}

/**
 * GenericTable Component
 * @param title: string
 * @param subtitle: string
 * @param headers: Header[]
 * @param response: ResponseAPI<T> | null
 * @param customButtons?: React.ReactNode[]
 * @param showAddButton?: boolean
 * @param refreshData: (filters?: Record<string, any>) => ResponseAPI<T>
 * @returns GenericTable Component
 * @example
 * <GenericTable
 *   title="Propiedades"
 *   subtitle="Aquí puedes ver todas las propiedades disponibles"
 *   showAddButton={true}
 *   headers={[
 *     { key: 'nombre', label: 'Nombre', filterable: true, slot: 'default' },
 *   ]}
 *   response={PropertiesRepository.getAllProperties()}
 *   refreshData={async () => {
 *     const data = await PropertiesRepository.refreshProperties();
 *     setProperties(Promise.resolve(data));
 *   }}
 * />
 */

const GenericTable = <T,>({
  title,
  subtitle,
  headers,
  response,
  customButtons,
  hrefAddButton = '',
  refreshData,
  grid_params,
  actions
}: GenericTableProps<T>) => {
  const buttons = customButtons ? customButtons : []

  const add_button = hrefAddButton ? (
    <Link href={hrefAddButton} key='add'>
      <Button variant='contained' color='primary'>
        Agregar
      </Button>
    </Link>
  ) : null

  buttons.push(add_button)

  return (
    <>
      <SectionHeader title={title} subtitle={subtitle} buttons={buttons} />

      {response && (
        <TableComponent
          refreshData={refreshData}
          showGeneralFilters={false}
          headers={headers}
          response={response as ResponseAPI<T> | null}
          grid_params={grid_params}
          actions={actions}
        />
      )}
    </>
  )
}

export default GenericTable
