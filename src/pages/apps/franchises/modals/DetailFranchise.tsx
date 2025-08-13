'use client'

import React from 'react'

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

import {
  Card, CardHeader, CardContent, CardActions,
  Accordion, AccordionSummary, AccordionDetails,

} from '@mui/material'

// icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'

import type { IFranchise } from '@/types/apps/FranquiciaTypes'
import { mappedFranchiseTypes } from '@/validations/franchiseSchema'


interface DetailFranchiseModalProps {
  open: boolean
  onClose: () => void
  franchise: IFranchise
}

const DetailFranchiseModal: React.FC<DetailFranchiseModalProps> = ({ open, onClose, franchise }) => {


  if (!franchise) return null

  const handleClose = () => {
    onClose()
  }


  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <Card sx={{ width: '100%' }}>
        <CardHeader
          title={
            <Typography variant='h5' fontWeight={700}>
              FRANQUICIA {franchise.franchise_type}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Box display='flex' flexDirection='column' alignItems='flex-start' gap={2} width='100%'>
            <Box display='flex' flexDirection='column' alignItems='flex-start' gap={1}>
              <Typography variant='subtitle2' color='text.secondary'>
                Nombre
              </Typography>
              <Typography variant='body1' fontWeight={500} gutterBottom>
                {franchise.name}
              </Typography>
            </Box>

            {/* Franquicia Padre - Collapse */}
            <Box width='100%' mt={2}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='parent-content' id='parent-header'>
                  <Typography variant='subtitle1' fontWeight={600}>
                    Franquicia Padre
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant='body1' fontWeight={400}>
                    {franchise.parent ? franchise.parent.name : 'Ninguna'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>

            {/* Usuarios - Collapse */}
            <Box width='100%' mt={2}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='users-content' id='users-header'>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant='subtitle1' fontWeight={600}>
                      Usuarios
                    </Typography>
                    <Chip
                      label={franchise.users?.length || 0}
                      color={franchise.users && franchise.users.length > 0 ? 'primary' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {franchise.users && franchise.users.length > 0 ? (
                    <List dense>
                      {franchise.users.map(user => (
                        <ListItem key={user.id} disablePadding>
                          <ListItemIcon>
                            <PersonIcon color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={user.name}
                            secondary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <EmailIcon fontSize="small" color="action" />
                                <Typography variant='caption' color='text.secondary'>
                                  {user.email}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      Sin usuarios asignados
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>

            {/* Hijas - Collapse */}
            <Box width='100%' mt={2}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='children-content' id='children-header'>
                  <Typography variant='subtitle1' fontWeight={600}>
                    Hijas
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {franchise.children && franchise.children.length > 0 ? (
                    <List dense>
                      {franchise.children.map(child => (
                        <ListItem key={child.id} disablePadding>
                          <ListItemText
                            primary={child.name}
                            secondary={
                              <>
                                <Typography variant='caption' color='text.secondary'>
                                  {mappedFranchiseTypes[child.franchise_type]}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      Sin hijas
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
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

export default DetailFranchiseModal
