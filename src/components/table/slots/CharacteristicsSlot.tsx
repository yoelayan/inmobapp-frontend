// React Imports
import React, { useState } from 'react'

// MUI Imports
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import DeleteIcon from '@mui/icons-material/Delete'

// Component Imports
import BooleanSlot from './BooleanSlot'

// Hooks Imports
import useSearches from '@/hooks/api/crm/useSearches'
import useConfirmDialog from '@/hooks/useConfirmDialog'

interface Characteristic {
  id: number
  characteristic_name: string
  value: string | boolean
  characteristic_type: string
  search_id?: string | number
}

interface CharacteristicsSlotProps {
  value: Characteristic[]
  allowDelete?: boolean
  onDelete?: () => void
}

const CharacteristicsSlot: React.FC<CharacteristicsSlotProps> = ({
  value,
  allowDelete = true,
  onDelete
}) => {
  const [open, setOpen] = useState(false)
  const { deleteCharacteristic } = useSearches()
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog()

  // If no characteristics or empty array, show dash
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <span>-</span>
  }

  // Handle deletion of a characteristic with confirmation
  const handleDeleteCharacteristic = (characteristic: Characteristic) => {
    const targetSearchId = characteristic.search_id

    if (!targetSearchId) {
      console.error('No search ID available for deletion')
      return
    }

    showConfirmDialog({
      title: '¿Eliminar característica?',
      message: `¿Estás seguro que deseas eliminar la característica "${characteristic.characteristic_name}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await deleteCharacteristic(String(targetSearchId), characteristic.id)
          if (onDelete) onDelete()
        } catch (error) {
          console.error('Error al eliminar la característica:', error)
        }
      }
    })
  }

  // Render the appropriate value based on characteristic_type
  const renderValue = (characteristic: Characteristic) => {
    if (!characteristic || characteristic.value === undefined || characteristic.value === null) {
      return '-'
    }

    if (characteristic.characteristic_type === 'boolean') {
      return <BooleanSlot value={characteristic.value} />
    }

    if (typeof characteristic.value === 'object') {
      return JSON.stringify(characteristic.value)
    }

    return String(characteristic.value)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="body2" sx={{ mr: 1 }}>
          {value.length} características
        </Typography>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(!open)
          }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit sx={{ mt: 1 }}>
        <Paper elevation={0} variant="outlined" sx={{ p: 1 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Característica</TableCell>
                  <TableCell>Valor</TableCell>
                  {allowDelete && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {value.map((characteristic) => (
                  <TableRow key={characteristic.id}>
                    <TableCell component="th" scope="row">
                      {characteristic.characteristic_name}
                    </TableCell>
                    <TableCell>{renderValue(characteristic)}</TableCell>
                    {allowDelete && (
                      <TableCell align="right">
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCharacteristic(characteristic)
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Collapse>
      <ConfirmDialog />
    </Box>
  )
}

export default CharacteristicsSlot
