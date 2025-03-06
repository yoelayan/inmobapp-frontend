// Mui imports
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

// Field Imports
import EditorField from '@components/form/EditorField'
import ImageField from '@components/form/ImageField'

// Types
import type { PropertyTabProps } from '../PropertyForm'

const fields = [
  {
    label: 'Descripcion',
    name: 'description',
    component: EditorField
  },
  {
    label: 'Imagenes',
    name: 'images',
    component: ImageField,
    props: {
      multiple: true
    }
  }
]

const InfoTab = ({ control, errors, setValue, getValues }: PropertyTabProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {fields.map((field, index) => {
          const Component = field.component

          return (
            <Grid size={12} key={index}>
              <Component
                name={field.name}
                control={control}
                setValue={setValue}
                error={errors[field.name]}
                label={field.label}
                value={getValues(field.name)}
                {...(field.props || {})}

              />
            </Grid>
          )
        })}

      </Grid>
    </Box>
  )
}

export default InfoTab
