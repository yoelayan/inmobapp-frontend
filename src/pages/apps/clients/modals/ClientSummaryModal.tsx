'use client'

import React, { useEffect, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'

import {
  Card, CardHeader, CardContent, CardActions,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'

// icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import BusinessIcon from '@mui/icons-material/Business'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

import type { IClient } from '@/types/apps/ClientesTypes'
import type { ISearch } from '@/types/apps/SearchTypes'
import type { IRealProperty } from '@/types/apps/RealtstateTypes'
import type { ResponseAPI } from '@/types/api/response'

import ClientsRepository from '@/services/repositories/crm/ClientsRepository'
import SearchesRepository from '@/services/repositories/crm/SearchesRepository'
import PropertiesRepository from '@/services/repositories/realstate/PropertiesRepository'

interface ClientSummaryModalProps {
  open: boolean
  onClose: () => void
  clientId: number
}

const ClientSummaryModal: React.FC<ClientSummaryModalProps> = ({ open, onClose, clientId }) => {
  const [client, setClient] = useState<IClient | null>(null)
  const [searches, setSearches] = useState<ResponseAPI<ISearch> | null>(null)
  const [properties, setProperties] = useState<ResponseAPI<IRealProperty> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!open || !clientId) return

    const loadData = async () => {
      setLoading(true)
      
      try {
        // Cargar cliente
        const c = await ClientsRepository.get(Number(clientId))
        
        setClient(c)

        // Cargar búsquedas
        // Filtrar búsquedas por cliente (API espera 'client')
        const s = await SearchesRepository.getAll({ page: 1, per_page: 100, client: clientId })
        
        setSearches(s)

        // Cargar propiedades donde el cliente es propietario
        try {
          // Filtrar propiedades por propietario (API suele usar 'owner')
          const props = await PropertiesRepository.getAll({ owner: clientId, page: 1, per_page: 100 })
          
          setProperties(props)
        } catch (error) {
          console.error('Error loading properties:', error)
        }

        // Usuarios asignados se obtienen del objeto client (assigned_to)
      } catch (error) {
        console.error('Error loading client data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [open, clientId])

  if (!open || !clientId) return null

  const handleClose = () => {
    onClose()
  }

  const assignedToName = typeof (client as any)?.assigned_to === 'object'
    ? ((client as any)?.assigned_to?.name || (client as any)?.assigned_to?.email || 'N/A')
    : null

  const franchiseName = typeof (client as any)?.franchise === 'object'
    ? ((client as any)?.franchise?.name || null)
    : null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <Card sx={{ width: '100%' }}>
        <CardHeader
          title={
            <Typography variant='h5' fontWeight={700}>
              {client?.name || 'Cliente'}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          {loading ? (
            <Box display='flex' justifyContent='center' p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box display='flex' flexDirection='column' alignItems='flex-start' gap={2} width='100%'>
              {/* Datos Básicos */}
              <Box width='100%'>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='client-data-content' id='client-data-header'>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon color="action" />
                      <Typography variant='subtitle1' fontWeight={600}>
                        Datos del Cliente
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display='flex' flexDirection='column' alignItems='flex-start' gap={2} width='100%'>
                      <Box display='flex' flexDirection='column' alignItems='flex-start' gap={1} width='100%'>
                        <Typography variant='subtitle2' color='text.secondary'>
                          Correo Electrónico
                        </Typography>
                        <Typography variant='body1' fontWeight={500}>
                          {client?.email || '—'}
                        </Typography>
                      </Box>

                      <Box display='flex' flexDirection='column' alignItems='flex-start' gap={1} width='100%'>
                        <Typography variant='subtitle2' color='text.secondary'>
                          Teléfono
                        </Typography>
                        <Typography variant='body1' fontWeight={500}>
                          {client?.phone || '—'}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Búsquedas */}
              <Box width='100%'>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='searches-content' id='searches-header'>
                    <Box display="flex" alignItems="center" gap={1}>
                      <SearchIcon color="action" />
                      <Typography variant='subtitle1' fontWeight={600}>
                        Búsquedas
                      </Typography>
                      <Chip
                        label={searches?.count || 0}
                        color={searches && searches.count > 0 ? 'primary' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {searches && searches.results && searches.results.length > 0 ? (
                      <List dense>
                        {searches.results.map(search => (
                          <ListItem key={search.id} disablePadding>
                            <ListItemIcon>
                              <SearchIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                              primary={search.description || 'Sin descripción'}
                              secondary={
                                <Box display="flex" flexDirection="column" gap={0.5} mt={0.5}>
                                  <Typography variant='caption' color='text.secondary'>
                                    Presupuesto: ${Number(search.budget || 0).toLocaleString()}
                                  </Typography>
                                  {(search.state?.name || search.municipality?.name || search.parish?.name) && (
                                    <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
                                      {search.state?.name && (
                                        <Chip size="small" label={search.state.name} variant="outlined" />
                                      )}
                                      {search.municipality?.name && (
                                        <Chip size="small" label={search.municipality.name} variant="outlined" />
                                      )}
                                      {search.parish?.name && (
                                        <Chip size="small" label={search.parish.name} variant="outlined" />
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        Sin búsquedas registradas
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Propiedades */}
              <Box width='100%'>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='properties-content' id='properties-header'>
                    <Box display="flex" alignItems="center" gap={1}>
                      <HomeIcon color="action" />
                      <Typography variant='subtitle1' fontWeight={600}>
                        Propiedades
                      </Typography>
                      <Chip
                        label={properties?.count || 0}
                        color={properties && properties.count > 0 ? 'primary' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {properties && properties.results && properties.results.length > 0 ? (
                      <List dense>
                        {properties.results.map(property => (
                          <ListItem key={property.id} disablePadding>
                            <ListItemIcon>
                              <HomeIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                              primary={property.name || property.code || `Propiedad #${property.id}`}
                              secondary={
                                <Box display="flex" flexDirection="column" gap={0.5} mt={0.5}>
                                  {property.address && (
                                    <Typography variant='caption' color='text.secondary'>
                                      {property.address}
                                    </Typography>
                                  )}
                                  {property.price && (
                                    <Typography variant='caption' color='text.secondary'>
                                      Precio: ${Number(property.price).toLocaleString()}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        Este cliente no es propietario de ninguna propiedad
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Usuarios Asignados */}
              <Box width='100%'>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='users-content' id='users-header'>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon color="action" />
                      <Typography variant='subtitle1' fontWeight={600}>
                        Usuario Asignado
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {assignedToName ? (
                      <List dense>
                        <ListItem disablePadding>
                          <ListItemIcon>
                            <PersonIcon color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={assignedToName}
                            secondary={
                              typeof (client as any)?.assigned_to === 'object' && (client as any)?.assigned_to?.email ? (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <EmailIcon fontSize="small" color="action" />
                                  <Typography variant='caption' color='text.secondary'>
                                    {(client as any)?.assigned_to?.email}
                                  </Typography>
                                </Box>
                              ) : null
                            }
                          />
                        </ListItem>
                      </List>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        Sin usuario asignado
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Franquicia */}
              <Box width='100%'>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='franchise-content' id='franchise-header'>
                    <Box display="flex" alignItems="center" gap={1}>
                      <BusinessIcon color="action" />
                      <Typography variant='subtitle1' fontWeight={600}>
                        Franquicia
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {franchiseName ? (
                      <Typography variant='body1' fontWeight={400}>
                        {franchiseName}
                      </Typography>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        Sin franquicia asignada
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Coincidencias */}
              <Box width='100%'>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='matches-content' id='matches-header'>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CompareArrowsIcon color="action" />
                      <Typography variant='subtitle1' fontWeight={600}>
                        Coincidencias
                      </Typography>
                      <Chip
                        label={searches?.count || 0}
                        color={searches && searches.count > 0 ? 'primary' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {searches && searches.results && searches.results.length > 0 ? (
                      <Typography variant='body2' color='text.secondary'>
                        Las coincidencias se calculan en base a las búsquedas del cliente. 
                        Total de búsquedas activas: {searches.count || 0}
                      </Typography>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        No hay búsquedas registradas para calcular coincidencias
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} color='primary' variant='contained'>
            Cerrar
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  )
}

export default ClientSummaryModal
