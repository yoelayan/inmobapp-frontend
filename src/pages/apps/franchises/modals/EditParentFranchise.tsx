'use client'

import React, { useState, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

import {
  Card, CardHeader, CardContent, CardActions
} from '@mui/material'

// icons
import EditIcon from '@mui/icons-material/Edit'
import InfoIcon from '@mui/icons-material/Info'

import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import { mappedFranchiseTypes } from '@/validations/franchiseSchema'
import useFranchises from '@/hooks/api/realstate/useFranchises'
import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'

interface EditParentFranchiseModalProps {
  open: boolean
  onClose: () => void
  franchise: IFranchise | null
  onSuccess?: () => void
}

const EditParentFranchiseModal: React.FC<EditParentFranchiseModalProps> = ({
  open,
  onClose,
  franchise,
  onSuccess
}) => {
  const { fetchValidParents } = useFranchises()

  const [validParents, setValidParents] = useState<IFranchise[]>([])
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open && franchise) {
      loadValidParents()
      setSelectedParentId(franchise.parent?.id || null)
      setError(null)
    } else {
      // Reset state when closing
      setValidParents([])
      setSelectedParentId(null)
      setError(null)
    }
  }, [open, franchise])

  const loadValidParents = async () => {
    if (!franchise?.id) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetchValidParents(franchise.id)
      setValidParents(response.results || [])
    } catch (err: any) {
      setError('Error al cargar las franquicias válidas')
      console.error('Error loading valid parents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!franchise?.id) return

    setSaving(true)
    setError(null)

    try {
      const updatePayload = {
        name: franchise.name,
        franchise_type: franchise.franchise_type,
        parent: selectedParentId
      }

      console.log('Updating franchise:', franchise.id, updatePayload)
      await FranchisesRepository.update(franchise.id, updatePayload)

      // Call success callback to refresh table
      onSuccess?.()

      // Close modal
      onClose()
    } catch (err: any) {
      // Handle validation errors from backend
      console.error('Error updating franchise:', err)

      if (err.response?.data) {
        // Handle specific validation errors
        if (typeof err.response.data === 'object') {
          const errorMessages = Object.values(err.response.data).flat()
          setError(errorMessages.join('. '))
        } else {
          setError(err.response.data.toString())
        }
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Error al actualizar la franquicia')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      onClose()
    }
  }

  if (!franchise) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <Card sx={{ width: '100%' }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <EditIcon color="primary" />
              <Typography variant='h6' fontWeight={600}>
                Editar Franquicia Padre
              </Typography>
            </Box>
          }
          subheader={
            <Typography variant='body2' color='text.secondary'>
              {franchise.name} - {mappedFranchiseTypes[franchise.franchise_type]}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Box display='flex' flexDirection='column' gap={3} width='100%'>

            {/* Current parent info */}
            <Box>
              <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                Franquicia Padre Actual
              </Typography>
              <Typography variant='body1' fontWeight={500}>
                {franchise.parent ? franchise.parent.name : 'Sin padre asignado'}
              </Typography>
            </Box>

            {/* Error display */}
            {error && (
              <Alert severity="error" variant="outlined">
                {error}
              </Alert>
            )}

            {/* Loading state */}
            {loading ? (
              <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={3}>
                <CircularProgress size={40} />
                <Typography variant='body2' color='text.secondary'>
                  Cargando franquicias válidas...
                </Typography>
              </Box>
            ) : (
              <>
                {/* Parent selector */}
                <FormControl fullWidth>
                  <InputLabel id="parent-select-label">Nuevo Padre</InputLabel>
                  <Select
                    labelId="parent-select-label"
                    value={selectedParentId || ''}
                    onChange={(e) => setSelectedParentId(e.target.value === '' ? null : Number(e.target.value))}
                    label="Nuevo Padre"
                    disabled={saving}
                  >
                    <MenuItem value="">
                      <em>(Sin padre)</em>
                    </MenuItem>
                    {validParents.map((parent) => (
                      <MenuItem key={parent.id} value={parent.id}>
                        {parent.name} - {mappedFranchiseTypes[parent.franchise_type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Info about hierarchy rules */}
                <Alert severity="info" variant="outlined" icon={<InfoIcon />}>
                  <Typography variant='caption' component="div">
                    <strong>Reglas de Jerarquía:</strong>
                  </Typography>
                  <Typography variant='caption' component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                    <li>Las franquicias Master no pueden tener padre</li>
                    <li>Una franquicia no puede ser padre de sí misma</li>
                    <li>No se permiten ciclos en la jerarquía</li>
                    <li>Máximo 2 niveles de profundidad</li>
                  </Typography>
                </Alert>

                {/* Show children if any */}
                {franchise.children && franchise.children.length > 0 && (
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary' gutterBottom>
                      Franquicias Hijas ({franchise.children.length})
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {franchise.children.map(child => (
                        <Typography
                          key={child.id}
                          variant='caption'
                          sx={{
                            bgcolor: 'action.hover',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          {child.name}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={saving}
            color='inherit'
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || saving}
            color='primary'
            variant='contained'
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  )
}

export default EditParentFranchiseModal
