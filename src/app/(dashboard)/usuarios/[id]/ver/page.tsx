'use client'

// React Imports
import React, { useEffect, useState } from 'react'

import { Card, CardContent, Typography, CircularProgress, Box, Grid2 as Grid, Chip, Avatar } from '@mui/material'

// Component Imports
import SectionHeader from '@/components/layout/horizontal/SectionHeader'
import UsersRepository from '@/services/repositories/users/UsersRepository'
import type { IUser } from '@/types/apps/UserTypes'

interface ViewUserProps {
  params: {
    id: string
  }
}

const ViewUser: React.FC<ViewUserProps> = ({ params }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await UsersRepository.get(Number(params.id))

        setUser(response)
      } catch (err) {
        setError('Error al cargar los datos del usuario')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [params.id])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <span style={{ marginLeft: '10px' }}>Cargando datos del usuario...</span>
      </Box>
    )
  }

  if (error || !user) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <Typography color='error'>{error || 'Usuario no encontrado'}</Typography>
      </Box>
    )
  }

  return (
    <>
      <SectionHeader title='Detalles del Usuario' subtitle={`Información completa de ${user.name}`} />

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Información del perfil */}
            <Grid size={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={user.image || undefined}
                  alt={user.name}
                  sx={{ width: 80, height: 80, mr: 2 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant='h5' fontWeight='bold'>
                    {user.name}
                  </Typography>
                  <Typography variant='body1' color='text.secondary'>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='h6' gutterBottom>
                Información Personal
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Nombre Completo
                </Typography>
                <Typography variant='body1' fontWeight='bold'>
                  {user.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Email
                </Typography>
                <Typography variant='body1'>
                  {user.email}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Nombre de Usuario
                </Typography>
                <Typography variant='body1'>
                  {user.username || 'N/A'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='h6' gutterBottom>
                Estado y Permisos
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Estado
                </Typography>
                <Chip
                  label={user.is_active ? 'Activo' : 'Inactivo'}
                  color={user.is_active ? 'success' : 'error'}
                  size='small'
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Acceso al Admin
                </Typography>
                <Chip
                  label={user.is_staff ? 'Sí' : 'No'}
                  color={user.is_staff ? 'primary' : 'default'}
                  size='small'
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Superusuario
                </Typography>
                <Chip
                  label={user.is_superuser ? 'Sí' : 'No'}
                  color={user.is_superuser ? 'warning' : 'default'}
                  size='small'
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='h6' gutterBottom>
                Grupos y Permisos
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Grupos
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {user.group_names && user.group_names.length > 0 ? (
                    user.group_names.map((group, index) => (
                      <Chip key={index} label={group} variant='outlined' size='small' />
                    ))
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      Sin grupos asignados
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='h6' gutterBottom>
                Información de Acceso
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Fecha de Registro
                </Typography>
                <Typography variant='body1'>
                  {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Último Acceso
                </Typography>
                <Typography variant='body1'>
                  {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default ViewUser
