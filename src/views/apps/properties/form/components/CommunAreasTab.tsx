import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

import type { PropertyTabProps } from '../PropertyForm'
import SwitchField from '@components/form/SwitchField'

const CommunAreasTab = ({ control, errors, setValue, getValues }: PropertyTabProps) => {
  const renderSwitchs = () => {

    const switchs = [
      {
        label: 'Tanque de Agua',
        name: 'characteristics__has_water_tank'
      },
      {
        label: 'Ascensor',
        name: 'characteristics__has_elevator'
      },
      {
        label: 'Seguridad Privada',
        name: 'characteristics__has_private_security'
      },
      {
        label: 'Parque Infantil',
        name: 'characteristics__has_playground'
      },
      {
        label: 'Piscina',
        name: 'characteristics__has_swimming_pool'
      },
      {
        label: 'Gimnasio',
        name: 'characteristics__has_gym'
      },
      {
        label: 'Parrilleras',
        name: 'characteristics__has_grill'
      },
      {
        label: 'Salon de Fiestas',
        name: 'characteristics__has_party_room'
      },
      {
        label: 'Cancha Deportiva',
        name: 'characteristics__has_sports_field'
      },
      {
        label: 'Pozo Profundo',
        name: 'characteristics__has_deep_well'
      },
      {
        label: 'Planta Electrica Común',
        name: 'characteristics__has_common_electric_plant'
      }

    ]
    
    return switchs.map((item, index) => (
          <Grid size={{ xs: 6, sm: 6, md: 4 }} key={index}>
            <SwitchField
              value={getValues(item.name)}
              label={item.label}
              name={item.name}
              control={control}
              setValue={setValue}
            />
          </Grid>
        ))
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid container size={12} columns={{ xs: 4, sm: 8, md: 12 }} direction={'row'}>
          {renderSwitchs()}
        </Grid>
      </Grid>
    </Box>
  )
}

export default CommunAreasTab
