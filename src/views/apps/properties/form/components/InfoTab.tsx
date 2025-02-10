// Mui imports
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Field Imports
import EditorField from '@components/form/EditorField'
import ImageField from '@components/form/ImageField'

// Types
import type { PropertyTabProps } from '../PropertyForm'

const InfoTab = ({ control, errors, setValue, getValues }: PropertyTabProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <EditorField
            label='Descripción'
            name='descripcion'
            control={control}
            error={errors.descripcion}
            setValue={setValue}
            value={getValues('descripcion')}
          />
        </Grid>
        <Grid size={12}>
          <ImageField
            multiple
            label='Imagenes'
            name='imagenes'
            control={control}
            error={errors.imagenes}
            setValue={setValue}
            value={getValues('imagenes')}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default InfoTab
