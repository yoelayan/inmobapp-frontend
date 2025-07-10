// React imports
import React, { useState } from 'react'

// Mui Imports
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

// Types imports
import type { TableAction } from '../types'

interface TableActionsProps {
  row: Record<string, any>
  actions?: TableAction[]
}

const TableActions = ({ row, actions }: TableActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  if (!actions || actions.length === 0) return null

  // Filter actions based on condition
  const filteredActions = actions.filter(action =>
    !action.condition || action.condition(row)
  )

  if (filteredActions.length === 0) return null

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation() // Prevent row click if table has onRowClick
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleActionClick = (action: TableAction) => {
    if (action.onClick) {
      action.onClick(row)
    }

    handleClose()
  }

  return (
    <>
      <Tooltip title="Acciones">
        <IconButton
          aria-label="acciones"
          aria-controls={open ? 'table-actions-menu' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="table-actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {filteredActions.map((action, index) => {
          const isDisabled = typeof action.disabled === 'function'
            ? action.disabled(row)
            : action.disabled

          return (
            <MenuItem
              key={action.label || index}
              onClick={() => handleActionClick(action)}
              disabled={isDisabled}
              sx={{
                minHeight: 40,
                gap: 1,
                ...action.style
              }}
              className={action.className}
            >
              {action.icon && action.icon}
              {action.label}
              {action.component && action.component}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default TableActions
