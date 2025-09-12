import React, { useState, useMemo, useCallback } from 'react'

import { useController, useFormContext } from 'react-hook-form'

import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Divider,
  Chip,
  Alert,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  FormHelperText,
  CardHeader
} from '@mui/material'

import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  SelectAll as SelectAllIcon,
  Clear as ClearIcon
} from '@mui/icons-material'

import { permissions, type Permission, type GroupPermission } from '@/auth/data/permissions'
import type { PermissionsFieldProps } from '@/types/common/forms.types'

const PermissionsField = <T extends Record<string, any>>({
  name,
  label,
  disabled = false,
  showGroups = false,
  showSearch = true,
  showFilters = true,
  collapsible = false
}: Omit<PermissionsFieldProps<T>, 'control'>) => {
  const { control } = useFormContext()

  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({ name, control })

  const [searchTerm, setSearchTerm] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [filterBySelected, setFilterBySelected] = useState(false)



  // Memoized selected permissions
  const selectedPermissions = useMemo(() => (value as string[]) || [], [value])

  // Optimized group selection helpers with Set for faster lookups
  const selectedPermissionsSet = useMemo(() => new Set(selectedPermissions), [selectedPermissions])

  // Memoized permission filtering with better optimization
  const filteredPermissions = useMemo(() => {
    let filtered = permissions

    if (searchTerm) {
      const term = searchTerm.toLowerCase()

      filtered = filtered.reduce<GroupPermission[]>((acc, group) => {
        const filteredPerms = group.permissions.filter(
          p =>
            p.name.toLowerCase().includes(term) ||
            p.codename.toLowerCase().includes(term) ||
            group.name.toLowerCase().includes(term)
        )

        if (filteredPerms.length > 0) {
          acc.push({ ...group, permissions: filteredPerms })
        }

        return acc
      }, [])
    }

    if (filterBySelected) {
      filtered = filtered.reduce<GroupPermission[]>((acc, group) => {
        const filteredPerms = group.permissions.filter(p => selectedPermissions.includes(p.codename))

        if (filteredPerms.length > 0) {
          acc.push({ ...group, permissions: filteredPerms })
        }

        return acc
      }, [])
    }

    return filtered
  }, [searchTerm, filterBySelected, selectedPermissions])

  // Memoized counts - optimize total permissions calculation
  const totalPermissions = useMemo(
    () => permissions.reduce((acc, group) => acc + group.permissions.length, 0),
    [] // Only calculate once since permissions data is static
  )

  const selectedCount = selectedPermissions.length

  // Optimized handlers
  const handlePermissionChange = useCallback(
    (permissionCode: string, checked: boolean) => {
      if (checked) {
        // Only add if not already present
        if (!selectedPermissionsSet.has(permissionCode)) {
          onChange([...selectedPermissions, permissionCode])
        }
      } else {
        // Only remove if present
        if (selectedPermissionsSet.has(permissionCode)) {
          onChange(selectedPermissions.filter(p => p !== permissionCode))
        }
      }
    },
    [onChange, selectedPermissions, selectedPermissionsSet]
  )

  const handleGroupChange = useCallback(
    (groupPermissions: Permission[], checked: boolean) => {
      const codes = groupPermissions.map(p => p.codename)
      const codesSet = new Set(codes)

      if (checked) {
        // Add only permissions that aren't already selected
        const newPermissions = codes.filter(code => !selectedPermissionsSet.has(code))

        if (newPermissions.length > 0) {
          onChange([...selectedPermissions, ...newPermissions])
        }
      } else {
        // Remove only permissions that are currently selected
        const filteredPermissions = selectedPermissions.filter(p => !codesSet.has(p))

        if (filteredPermissions.length !== selectedPermissions.length) {
          onChange(filteredPermissions)
        }
      }
    },
    [onChange, selectedPermissions, selectedPermissionsSet]
  )

  const handleSelectAll = useCallback(() => {
    const allPermissions = permissions.flatMap(g => g.permissions.map(p => p.codename))

    // Only update if not all permissions are already selected
    if (selectedPermissions.length !== allPermissions.length) {
      onChange(allPermissions)
    }
  }, [onChange, selectedPermissions])

  const handleClearAll = useCallback(() => {
    // Only clear if there are permissions to clear
    if (selectedPermissions.length > 0) {
      onChange([])
    }
  }, [onChange, selectedPermissions])

  const handleGroupExpand = useCallback((groupCode: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupCode) ? prev.filter(code => code !== groupCode) : [...prev, groupCode]
    )
  }, [])

  // Group selection helpers
  const isGroupSelected = useCallback(
    (groupPermissions: Permission[]) => groupPermissions.every(p => selectedPermissionsSet.has(p.codename)),
    [selectedPermissionsSet]
  )

  const isGroupPartiallySelected = useCallback(
    (groupPermissions: Permission[]) => {
      let selectedInGroup = 0
      const totalInGroup = groupPermissions.length

      for (const permission of groupPermissions) {
        if (selectedPermissionsSet.has(permission.codename)) {
          selectedInGroup++
        }
      }

      return selectedInGroup > 0 && selectedInGroup < totalInGroup
    },
    [selectedPermissionsSet]
  )

  // Render group (unifica lógica colapsable y no colapsable)
  const renderGroup = useCallback(
    (group: GroupPermission, groupIndex: number) => {
      const isExpanded = expandedGroups.includes(group.codename)

      // Optimize selected count calculation using Set
      const selectedInGroup = group.permissions.reduce((count, p) =>
        selectedPermissionsSet.has(p.codename) ? count + 1 : count, 0
      )

      const groupHeader = (
        <Box className='flex flex-col sm:flex-row sm:items-center gap-2 mb-2'>
          {showGroups && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isGroupSelected(group.permissions)}
                  indeterminate={isGroupPartiallySelected(group.permissions)}
                  onChange={e => handleGroupChange(group.permissions, e.target.checked)}
                  disabled={disabled}
                  color='primary'
                  onClick={e => collapsible && e.stopPropagation()}
                  className='!p-2'
                />
              }
              label={
                <Typography variant='h6' className='font-bold text-base sm:text-lg'>
                  {group.name}
                </Typography>
              }
              className='!m-0'
              onClick={e => collapsible && e.stopPropagation()}
            />
          )}
          {!showGroups && (
            <Typography variant='h6' className='font-bold text-base sm:text-lg'>
              {group.name}
            </Typography>
          )}
          <Chip
            label={`${selectedInGroup}/${group.permissions.length}`}
            size='small'
            color='primary'
            variant='outlined'
            className='sm:ml-2'
          />
        </Box>
      )

      const groupPermissions = (
        <FormGroup sx={{ ml: showGroups ? 4 : 0 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
            {group.permissions.map((permission: Permission) => (
              <FormControlLabel
                key={permission.codename}
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(permission.codename)}
                    onChange={e => handlePermissionChange(permission.codename, e.target.checked)}
                    disabled={disabled}
                    color='primary'
                  />
                }
                label={permission.name}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
          </Box>
        </FormGroup>
      )

      if (collapsible) {
        return (
          <Accordion
            key={group.codename}
            expanded={isExpanded}
            onChange={() => handleGroupExpand(group.codename)}
            sx={{
              '&:before': { display: 'none' },
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'divider',
              mb: 1
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{groupHeader}</AccordionSummary>
            <AccordionDetails>{groupPermissions}</AccordionDetails>
          </Accordion>
        )
      }

      return (
        <Box key={group.codename}>
          {groupHeader}
          {groupPermissions}
          {groupIndex < filteredPermissions.length - 1 && <Divider sx={{ mt: 2 }} />}
        </Box>
      )
    },
    [
      expandedGroups,
      selectedPermissionsSet,
      selectedPermissions,
      showGroups,
      collapsible,
      disabled,
      isGroupSelected,
      isGroupPartiallySelected,
      handleGroupChange,
      handleGroupExpand,
      handlePermissionChange,
      filteredPermissions.length
    ]
  )

  return (
    <div>


      {error && (
        <FormHelperText error sx={{ mt: 1 }}>{error.message}</FormHelperText>
      )}

      <Card sx={{ width: '100%' }}>
        <CardHeader
          title={label}
        />
        <CardContent>
          {showSearch && (
            <TextField
              fullWidth
              placeholder='Buscar permisos...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position='end'>
                      <IconButton size='small' onClick={() => setSearchTerm('')}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              sx={{ mb: 3 }}
            />
          )}

          {showFilters && (
            <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center">
              <Button
                variant="outlined"
                startIcon={<SelectAllIcon />}
                onClick={handleSelectAll}
                disabled={disabled}
                className="w-full sm:w-auto"
              >
                Seleccionar Todo
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearAll}
                disabled={disabled}
                className="w-full sm:w-auto"
              >
                Limpiar Todo
              </Button>
              <div className="flex items-center">
                <Checkbox
                  checked={filterBySelected}
                  onChange={e => setFilterBySelected(e.target.checked)}
                  color="primary"
                  id="filter-by-selected"
                  className="p-0 mr-2"
                />
                <label htmlFor="filter-by-selected" className="text-sm select-none">
                  Mostrar solo seleccionados
                </label>
              </div>
            </div>
          )}



          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              maxHeight: 400,
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: 8,
                backgroundColor: 'transparent'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme => theme.palette.grey[300],
                borderRadius: 4
              },
              '&:hover::-webkit-scrollbar-thumb': {
                backgroundColor: theme => theme.palette.grey[400]
              },
              scrollbarWidth: 'thin',
              scrollbarColor: theme => `${theme.palette.grey[400]} transparent`
            }}
          >
            {filteredPermissions.map(renderGroup)}
          </Box>

          {filteredPermissions.length === 0 && (
            <Alert severity='info' sx={{ mt: 2 }}>
              No se encontraron permisos que coincidan con tu búsqueda.
            </Alert>
          )}

          <Box className='flex justify-end mt-4'>
            <Typography variant='body2' color='text.secondary'>
              <strong>Permisos seleccionados:</strong> {selectedCount} de {totalPermissions}
              {searchTerm && ` (filtrados de ${totalPermissions} total)`}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}

export default PermissionsField
