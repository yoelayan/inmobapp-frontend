// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller } from 'react-hook-form'

import type { PropertyTabProps } from '../PropertyForm'
import CustomTextField from '@core/components/mui/TextField'
import SwitchFieldProps from '@components/form/SwitchField'
import SelectFieldAsync from '@/components/form/SelectFieldAsync'
import NumberField from '@/components/form/NumberField'

// Hooks
import useCities from '@hooks/api/useCities'
import useStates from '@hooks/api/useStates'
import usePropertyAge from '@/hooks/api/properties/usePropertyAge'
import usePropertyView from '@/hooks/api/properties/usePropertyView'
import usePropertyFurnished from '@/hooks/api/properties/usePropertyFurnished'

const FeaturesTab = ({ control, errors, setValue, getValues }: PropertyTabProps) => {
  const [defaultFiltersCities, setDefaultFiltersCities] = useState<any>(getValues('estado'))

  const { data: states, refreshData: refreshStates, fetchData: fetchStates } = useStates()
  const { data: propertyAges, refreshData: refreshPropertyAges, fetchData: fetchPropertyAges } = usePropertyAge()

  const {
    data: propertyFurnisheds,
    refreshData: refreshPropertyFurnisheds,
    fetchData: fetchPropertyFurnished
  } = usePropertyFurnished()

  const { data: cities, refreshData: refreshCities, fetchData: fetchCities } = useCities(defaultFiltersCities)

  const handleStateChange = (stateSelected: Record<string, any>) => {
    if (!stateSelected) {
      setDefaultFiltersCities(null)
      
return
    }

    setDefaultFiltersCities({ estado: stateSelected.value })
    refreshCities({ estado: stateSelected.value })
  }

  useEffect(() => {
    fetchStates()
    fetchPropertyAges()
    fetchPropertyFurnished()
    fetchCities()
  }, [])

  useEffect(() => {
    const stateSelected = getValues('estado')

    if (stateSelected) {
      setDefaultFiltersCities({ estado: stateSelected.value })
      refreshCities({ estado: stateSelected.value })
    } else {
      setDefaultFiltersCities(null)
    }
  }, [getValues('estado')])

  const renderSelects = () => {
    const selects = [
      {
        label: 'Antiguedad del inmueble',
        name: 'antiguedadInmueble',
        data: propertyAges,
        refreshData: refreshPropertyAges
      },
      {
        label: 'Amoblado',
        name: 'amoblado',
        data: propertyFurnisheds,
        refreshData: refreshPropertyFurnisheds
      }
    ]

    
return selects.map((item, index) => (
      <Grid size={6} key={index}>
        <SelectFieldAsync
          label={item.label}
          name={item.name}
          control={control}
          error={errors[item.name]}
          response={item.data}
          refreshData={item.refreshData}
          setValue={setValue}
          value={getValues(item.name)}
          dataMap={{ value: 'id', label: 'nombre' }}
        />
      </Grid>
    ))
  }

  const renderSwitchs = () => {
    const switchs = [
      { label: 'Sala de Estar', name: 'salaEstar' },
      { label: 'Estudio', name: 'estudio' },
      { label: 'Terraza / Jardin', name: 'terrazaJardin' },
      { label: 'Lavadero', name: 'lavadero' },
      { label: 'Maletero / Bodega', name: 'maleteroBodega' },
      { label: 'Tanque de Agua', name: 'tanqueAgua' },
      { label: 'Planta Electrica', name: 'plantaElectrica' }
    ]

    
return switchs.map((item, index) => (
      <Grid size={12} key={index}>
        <SwitchFieldProps
          label={item.label}
          name={item.name}
          control={control}
          setValue={setValue}
          value={getValues(item.name)}
        />
      </Grid>
    ))
  }

  const renderNumberInputs = () => {
    const numberInputs = [
      {
        label: 'Mts2',
        name: 'mts2',
        integer: false
      },
      {
        label: 'Mts2 Construidos',
        name: 'mts2Construidos',
        integer: false
      },
      {
        label: 'Plantas',
        name: 'plantas',
        integer: true
      },
      {
        label: 'Habitaciones',
        name: 'habitaciones',
        integer: true
      },
      {
        label: 'Baños',
        name: 'banos',
        integer: true
      },
      {
        label: 'Baños de Servicio',
        name: 'banosServicio',
        integer: true
      },
      {
        label: 'Habitaciones de Servicio',
        name: 'habitacionesServicio',
        integer: true
      },
      {
        label: 'Ptos de Estacionamiento',
        name: 'ptosEstacionamiento',
        integer: true
      }
    ]

    
return numberInputs.map((item, index) => (
      <Grid size={4} key={index}>
        <NumberField
          label={item.label}
          name={item.name}
          control={control}
          error={errors[item.name]}
          setValue={setValue}
          value={getValues(item.name)}
          integer={item.integer}
        />
      </Grid>
    ))
  }

  const renderUbigeo = () => {
    return (
      <Grid container size={12} className='mt-4'>
        <Grid size={6}>
          <SelectFieldAsync
            label='Estado'
            name='estado'
            control={control}
            error={errors.estado}
            response={states}
            refreshData={refreshStates}
            dataMap={{ value: 'id', label: 'nombre' }}
            filter_name='search'
            onChange={handleStateChange}
            setValue={setValue}
            value={getValues('estado')}
          />
        </Grid>
        <Grid size={6}>
          <SelectFieldAsync
            label='Ciudad'
            name='ciudad'
            control={control}
            error={errors.ciudad}
            response={cities}
            refreshData={refreshCities}
            dataMap={{ value: 'id', label: 'nombre' }}
            filter_name='search'
            isDisabled={!defaultFiltersCities}
            setValue={setValue}
            value={getValues('ciudad')}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name='direccion'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                label='Dirección'
                {...field}
                error={!!errors.direccion}
                helperText={errors.direccion?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {renderUbigeo()}

        <Grid container size={12} className='mt-4'>
          {renderSelects()}
        </Grid>
        <Grid container size={8} className='mt-4'>
          {renderNumberInputs()}
        </Grid>
        <Grid container size={4}>
          {renderSwitchs()}
        </Grid>
      </Grid>
    </Box>
  )
}

export default FeaturesTab
