import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'

import type { PropertyTabProps } from '../PropertyForm'
import SwitchFieldProps from '@components/form/SwitchField'

const CommunAreasTab = ({ control, errors, setValue, getValues }: PropertyTabProps) => {
  const renderSwitchs = () => {
    const switchs = [
      { label: 'Tanque de Agua', name: 'tanqueAgua' },
      { label: 'Ascensor', name: 'ascensor' },
      { label: 'Seguridad Privada', name: 'seguridadPrivada' },
      { label: 'Parque Infantil', name: 'parqueInfantil' },
      { label: 'Piscina', name: 'piscina' },
      { label: 'Gimnasio', name: 'gimnasio' },
      { label: 'Parrilleras', name: 'parrilleras' },
      { label: 'Salon de Fiestas', name: 'salonFiestas' },
      { label: 'Cancha Deportiva', name: 'canchaDeportiva' },
      { label: 'Pozo Profundo', name: 'pozoProfundo' },
      { label: 'Planta Electrica Común', name: 'plantaElectricaComun' }
    ]

    
return switchs.map((item, index) => (
      <Grid size={{ xs: 6, sm: 6, md: 4 }} key={index}>
        <SwitchFieldProps
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
