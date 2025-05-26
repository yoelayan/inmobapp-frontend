// Tanstack Table imports
import { flexRender } from '@tanstack/react-table'

import type { Table } from '@tanstack/react-table'

// Mui Imports

import { Badge, Box, Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material'

import Grid from '@mui/material/Grid2'

// Components imports
import classnames from 'classnames'

import TableActions from './TableActions'

// Utils imports

// Types imports
import type { TableAction, Header } from '../TableComponent'

export interface GridTag {
  name: string
  label?: string
  icon?: React.ReactNode
  condition?: string
  searchOn?: (tag: any, row: any) => any
}

export interface GridProps {
  feature_image?: string
  title?: string
  subtitle?: string
  description?: string
  feature_value?: string
  sub_feature_value?: string
  tags?: GridTag[]
}
interface TableGridProps {
  table: Table<any>
  headers: Header[]
  actions?: TableAction[]
  grid_params?: GridProps
  renderFilter: (column: any) => React.ReactNode
}

const getTagValue = (tag: GridTag, row: any) => {
  let value = null

  if (tag.searchOn) {
    value = tag.searchOn(tag, row.original)
  } else {
    value = row.original[tag.name]
  }

  return value
}

const TableGrid = ({ table, headers, grid_params, actions, renderFilter }: TableGridProps) => {
  return (
    <>
      <Grid container spacing={2} className='p-4'>
        {table.getHeaderGroups().map(headerGroup => (
          <Grid
            container
            key={headerGroup.id}
            spacing={2}
            size={{ xs: 12, md: 3, lg: 3 }}
            sx={{ alignContent: 'flex-start', alignItems: 'flex-start' }}
          >
            {headerGroup.headers.map(header => (
              <Grid className='flex flex-col' key={header.id} size={{ xs: 12, md: 12, lg: 12 }}>
                {header.column.getCanFilter() && (
                  <>
                    <Box
                      className={classnames({
                        'flex items-start': header.column.getIsSorted(),
                        'cursor-pointer select-none': header.column.getCanSort()
                      })}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Typography variant='h6'>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Typography>
                      {{
                        asc: <i className='tabler-chevron-up text-xl' />,
                        desc: <i className='tabler-chevron-down text-xl' />
                      }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                    </Box>

                    {renderFilter(header.column)}
                  </>
                )}
              </Grid>
            ))}
          </Grid>
        ))}
        <Grid container size={{ xs: 12, md: 9, lg: 9 }}>
          {table.getRowModel().rows.map((row, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card>
                {grid_params ? (
                  <>
                    {grid_params.title && (
                      <CardHeader
                        title={row.original[grid_params.title]}
                        action={<TableActions row={row.original} actions={actions} />}
                        subheader={grid_params.subtitle ? (row.original[grid_params.subtitle] ?? '- - -') : ''}
                      />
                    )}
                    {grid_params.feature_image && (
                      <CardMedia
                        sx={{
                          objectFit: 'cover'
                        }}
                        component='img'
                        height='140'
                        src={row.original[grid_params.feature_image]}
                      />
                    )}

                    <CardContent>
                      {grid_params.feature_value && (
                        <Typography variant='body1' color='primary' component='p'>
                          <strong>{row.original[grid_params.feature_value] ?? '- - -'}</strong>
                        </Typography>
                      )}
                      {grid_params.sub_feature_value && (
                        <Typography variant='body2' color='textSecondary' component='p'>
                          {row.original[grid_params.sub_feature_value] ?? '- - -'}
                        </Typography>
                      )}
                      {grid_params.tags && (
                        <Grid container spacing={4} className='mt-4'>
                          {grid_params.tags.map((tag, index) => (
                            <Grid key={index} size={{ xs: 6, md: 3 }} className='flex flex-col items-center'>
                              <Badge badgeContent={getTagValue(tag, row) ?? 0} color='primary' showZero max={999999}>
                                {tag.icon}
                              </Badge>
                              <Typography variant='body2' color='textSecondary' component='p'>
                                {tag.label}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                      {grid_params.description && (
                        <Typography variant='body2' color='textSecondary' component='p'>
                          {row.original[grid_params.description] ?? 'Sin descripción'}
                        </Typography>
                      )}
                    </CardContent>
                  </>
                ) : (
                  <CardContent>
                    {headers.map(header => (
                      <Typography
                        key={header.key}
                        variant='body2'
                        color='textSecondary'
                        component='p'
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '1.2rem'
                        }}
                      >
                        <strong>{header.label}:</strong>
                        <span>{row.original[header.key]}</span>
                      </Typography>
                    ))}
                  </CardContent>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

export default TableGrid
