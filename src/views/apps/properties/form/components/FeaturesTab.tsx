// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Controller } from 'react-hook-form'

import type { PropertyTabProps } from '../PropertyForm'
import CustomTextField from '@core/components/mui/TextField'
import SwitchField from '@components/form/SwitchField'
import SelectFieldAsync from '@/components/form/SelectFieldAsync'
import NumberField from '@/components/form/NumberField'
import TextField from '@/components/form/TextField'
// Hooks
import useCities from '@/hooks/api/locations/useCities'
import useStates from '@/hooks/api/locations/useStates'

const FeaturesTab = ({ control, errors, setValue, getValues }: PropertyTabProps) => {
  const [defaultFiltersCities, setDefaultFiltersCities] = useState<any>(getValues('estado'))

  const { data: states, refreshData: refreshStates, fetchData: fetchStates } = useStates()

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

  const fields = [
    {
      label: 'Estado',
      name: 'state',
      component: SelectFieldAsync,
    },
    {
      label: 'Ciudad',
      name: 'city',
      component: SelectFieldAsync
    },
    {
      label: 'Dirección',
      name: 'address',
      component: TextField
    },
    {
      label: 'Mts2',
      name: 'characteristics__mts2',
      component: NumberField
    },
    {
      label: 'Mts2 Construidos',
      name: 'characteristics__mts2_build',
      component: NumberField
    },
    {
      label: 'Plantas',
      name: 'characteristics__floors',
      component: NumberField
    },
    {
      label: 'Habitaciones',
      name: 'characteristics__rooms',
      component: NumberField
    },
    {
      label: 'Baños',
      name: 'characteristics__bathrooms',
      component: NumberField
    },

    {
      label: 'Baños de Servicio',
      name: 'characteristics__service_bathrooms',
      component: NumberField
    },
    {
      label: 'Habitaciones de Servicio',
      name: 'characteristics__service_rooms',
      component: NumberField
    },

    {
      label: 'Ptos de Estacionamiento',
      name: 'characteristics__parking_spots',
      component: NumberField
    },

    {
      label: 'Sala de Estar',
      name: 'characteristics__has_living_room',
      component: SwitchField
    },

    {
      label: 'Estudio',
      name: 'characteristics__has_studio',
      component: SwitchField
    },

    {
      label: 'Terraza / Jardin',
      name: 'characteristics__has_garden',
      component: SwitchField
    },
    {
      label: 'Lavadero',
      name: 'characteristics__has_washer',
      component: SwitchField
    },

    {
      label: 'Maletero / Bodega',
      name: 'characteristics__has_garage',
      component: SwitchField
    },
    {
      label: 'Planta Electrica',
      name: 'characteristics__has_electric_plant',
      component: SwitchField
    }

  ]



  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {fields.map((field, index) => {
          const Component = field.component
          let response = null
          let refreshData = null
          let dataMap = undefined
          let onChange = undefined

          if (field.name === 'state') {
            response = states
            refreshData = refreshStates
            dataMap = { value: 'id', label: 'name' }
            onChange = handleStateChange
          } else if (field.name === 'city') {
            response = cities
            refreshData = refreshCities
            dataMap = { value: 'id', label: 'name' }
          }

          return (
            <Grid size={{
              md: 6,
              xs: 12,
            }} key={index}>
              {Component === SelectFieldAsync ? (
                <Component
                  name={field.name}
                  control={control}
                  setValue={setValue}
                  error={errors[field.name]}
                  label={field.label}
                  value={getValues(field.name)}
                  response={response}
                  refreshData={refreshData}
                  dataMap={dataMap}
                  onChange={onChange}
                />
              ) : Component === SwitchField ? (
                <Component
                  name={field.name}
                  control={control}
                  setValue={setValue}
                  error={errors[field.name]}
                  label={field.label}
                  value={getValues(field.name)}
                />
              ) : (
                
                  <Component
                    name={field.name}
                    control={control}
                    setValue={setValue}
                    label={field.label}
                    value={getValues(field.name)}
                    {...field}
                    error={errors[field.name]}
                  />
              )}
            </Grid>
          )
        })}

      </Grid>
    </Box>
  )
}

export default FeaturesTab
