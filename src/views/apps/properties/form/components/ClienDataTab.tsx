// React imports
import { useEffect, useState } from 'react'

// Hook imports

// Mui imports
import { Box, Modal, Button, Typography, IconButton, Container } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Grid from '@mui/material/Grid2'

import useClients from '@/hooks/api/clients/useClients'

// Components
import { ClientForm } from '@views/apps/clients/form/ClientForm'

// Field Imports
import SelectFieldAsync from '@/components/form/SelectFieldAsync'

// Types
import type { PropertyTabProps } from '../PropertyForm'

const ClienDataTab = ({ control, errors, setValue, getValues }: PropertyTabProps) => {
  const [open, setOpen] = useState(false)

  const { fetchData: getClients, data: clients, refreshData: refreshClients } = useClients()

  useEffect(() => {
    getClients()
  }, [])

  const ModalClient = () => {
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 1200,
      height: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4
    }

    
return (
      <Modal
        open={open}
        onClose={handleButtonModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Container>
          <Box sx={{ ...style }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={handleButtonModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            <ClientForm />
          </Box>
        </Container>
      </Modal>
    )
  }

  const handleButtonModal = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ModalClient />
      <Grid container spacing={2}>
        <Grid size={12}>
          <SelectFieldAsync
            value={getValues('cliente')}
            control={control}
            error={errors.cliente}
            name='cliente'
            label='Cliente'
            response={clients}
            setValue={setValue}
            refreshData={refreshClients}
            dataMap={{
              value: 'id',
              label: 'nombre'
            }}
          ></SelectFieldAsync>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant='contained' color='primary' onClick={handleButtonModal}>
            Crear Cliente
          </Button>
        </Box>
      </Grid>
    </Box>
  )
}

export default ClienDataTab
