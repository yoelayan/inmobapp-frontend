'use client'

// React Imports
import React, { useEffect, useState } from 'react'

import { Card, CardContent, Typography, CircularProgress, Box, Grid2 as Grid, Chip } from '@mui/material'

// Component Imports
import SectionHeader from '@/components/layout/horizontal/SectionHeader'
import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'
import type { IFranchise } from '@/types/apps/FranquiciaTypes'

interface ViewFranchiseProps {
  params: {
    id: string
  }
}

const ViewFranchise: React.FC<ViewFranchiseProps> = ({ params }) => {
  const [franchise, setFranchise] = useState<IFranchise | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        setLoading(true)
        const response = await FranchisesRepository.get(Number(params.id))

        setFranchise(response)
      } catch (err) {
        setError('Error al cargar los datos de la franquicia')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFranchise()
  }, [params.id])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Cargando datos de la franquicia...</span>
      </Box>
    )
  }

  if (error || !franchise) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <Typography color='error'>{error || 'Franquicia no encontrada'}</Typography>
      </Box>
    )
  }

  return (
    <>
      <SectionHeader title='Detalles de la Franquicia' subtitle={`Información completa de ${franchise.name}`} />

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='h6' gutterBottom>
                Información General
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Nombre
                </Typography>
                <Typography variant='body1' fontWeight='bold'>
                  {franchise.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Identificador
                </Typography>
                <Typography variant='body1'>
                  {franchise.identifier || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Tipo
                </Typography>
                <Chip
                  label={franchise.franchise_type === 'COMMERCIAL' ? 'Comercial' : 'Personal'}
                  color={franchise.franchise_type === 'COMMERCIAL' ? 'primary' : 'secondary'}
                  size='small'
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Estado
                </Typography>
                <Chip
                  label={franchise.is_active ? 'Activo' : 'Inactivo'}
                  color={franchise.is_active ? 'success' : 'error'}
                  size='small'
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='h6' gutterBottom>
                Información Adicional
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Franquicia Padre
                </Typography>
                <Typography variant='body1'>
                  {franchise.parent_name || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Fecha de Creación
                </Typography>
                <Typography variant='body1'>
                  {franchise.created_at ? new Date(franchise.created_at).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Última Actualización
                </Typography>
                <Typography variant='body1'>
                  {franchise.updated_at ? new Date(franchise.updated_at).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ViewFranchise
