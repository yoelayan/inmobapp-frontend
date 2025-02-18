// React imports
import { useEffect } from 'react'

// Mui imports
import { Box, Card, CardActions, CardContent, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'

// React Hook Form imports
import type { FieldError } from 'react-hook-form';
import { Controller } from 'react-hook-form'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'

// Fields Components
import SelectField from '@/components/form/SelectField'
import ImageField from '@/components/form/ImageField'

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
    <Box sx={{ position: 'fixed', top: 95, width: '24%' }}>
      <Card>
        <CardContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <ImageField
                  name='first_image_url'
                  control={control}
                  setValue={setValue}
                  error={errors.first_image_url}
                  label='Imagen Destacada'
                  value={getValues('first_image_url')}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name='nombre'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      label='Nombre del Inmueble'
                      {...field}
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <SelectField
                  value={getValues('status_inmueble')}
                  label='Estado'
                  name='status_inmueble'
                  control={control}
                  error={errors.status_inmueble as FieldError}
                  response={statues}
                  setValue={setValue}
                  dataMap={{ value: 'id', label: 'nombre' }}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <CardActions>
          <Button fullWidth type='submit' color='primary' variant='contained'>
            Guardar
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
}

export default Sidebar
