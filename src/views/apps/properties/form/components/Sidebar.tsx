// React imports
import { useEffect } from 'react'

// Mui imports
import { Box, Card, CardActions, CardContent, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'

// React Hook Form imports
import type { FieldError } from 'react-hook-form';
// Fields Components
import SelectField from '@/components/form/SelectField'
import TextField from '@/components/form/TextField';

// Hooks
import usePropertyStatus from '@/hooks/api/realstate/usePropertyStatus'

interface SidebarProps {
  control: any
  errors: any
  setValue: any
  getValues: any
}

const Sidebar = ({ control, errors, setValue, getValues }: SidebarProps) => {
  const { data: statues, fetchData: fetchStatues } = usePropertyStatus()

  useEffect(() => {
    fetchStatues()
  }, [])

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField 
                  label='Nombre del Inmueble'
                  name='name'
                  control={control}
                  error={errors.name}
                  value={getValues('name')}
                  setValue={setValue}
                />
              </Grid>
              <Grid size={12}>
                <SelectField
                  value={getValues('status')}
                  label='Estado'
                  name='status'
                  control={control}
                  error={errors.status as FieldError}
                  response={statues}
                  setValue={setValue}
                  dataMap={{ value: 'id', label: 'name' }}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <CardActions>
          <Button 
            fullWidth
            type='submit'
            color='primary'
            variant='contained'
          >
            Guardar
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
}

export default Sidebar
