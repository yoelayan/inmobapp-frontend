import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material'

import {
  Close as CloseIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

import type { IUserGroup } from '@/types/apps/UserTypes'

interface DetailRoleModalProps {
  open: boolean
  onClose: () => void
  role: IUserGroup | null
}

const DetailRoleModal: React.FC<DetailRoleModalProps> = ({ open, onClose, role }) => {
  if (!role) return null

  const permissionsCount = role.permissions?.length || 0
  const hasPermissions = permissionsCount > 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <GroupIcon color="primary" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Detalles del Rol
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          {/* Información básica del rol */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader
              title="Información del Rol"
              avatar={<SecurityIcon color="primary" />}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nombre del Rol
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {role.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    ID del Rol
                  </Typography>
                  <Typography variant="body1">
                    {role.id || 'Sin ID'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cantidad de Permisos
                  </Typography>
                  <Chip
                    label={`${permissionsCount} permiso${permissionsCount !== 1 ? 's' : ''}`}
                    color={hasPermissions ? 'success' : 'default'}
                    icon={<VpnKeyIcon />}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Permisos del rol */}
          <Card variant="outlined">
            <CardHeader
              title={`Permisos Asignados (${permissionsCount})`}
              avatar={<VpnKeyIcon color="primary" />}
            />
            <CardContent>
              {hasPermissions ? (
                <List dense>
                  {role.permissions.map((permission, index) => (
                    <React.Fragment key={permission.id || index}>
                      <ListItem sx={{ pl: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="medium">
                              {permission.codename}
                            </Typography>
                          }
                          secondary={
                            permission.id && (
                              <Typography variant="caption" color="text.secondary">
                                ID: {permission.id}
                              </Typography>
                            )
                          }
                        />
                      </ListItem>
                      {index < role.permissions.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="info" icon={<VpnKeyIcon />}>
                  <Typography variant="body2">
                    Este rol no tiene permisos asignados.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Aquí podrías navegar a la página de edición
            window.location.href = `/roles/${role.id}/editar/`
          }}
          disabled={!role.id}
        >
          Editar Rol
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DetailRoleModal
