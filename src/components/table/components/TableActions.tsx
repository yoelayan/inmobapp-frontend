// React imports
import React, { useState } from 'react';

// Mui Imports
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Types imports
import type { TableAction } from "../TableComponent";

interface TableActionsProps {
    row: Record<string, any>;
    actions?: TableAction[];
}

const TableActions = ({ row, actions }: TableActionsProps) => {
    if (!actions) return null
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
    setAnchorEl(null)
    }

    return (
        <>
            <IconButton
                aria-label='settings'
                aria-controls={open ? 'simple-menu' : undefined}
                aria-haspopup='true'
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
                {actions.map(action => (
                    <MenuItem key={action.label} onClick={() => action.onClick && action.onClick(row)}>
                        {action.icon && action.icon} {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default TableActions

