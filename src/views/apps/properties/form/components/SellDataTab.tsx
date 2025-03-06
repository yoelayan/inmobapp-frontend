// React Imports
import React, { useState, useEffect } from 'react'

// Interfaces
import { Box } from '@mui/material'

import Grid from '@mui/material/Grid2'

import type { PropertyTabProps } from '../PropertyForm'

// Hooks
import usePropertiyNegotiation from '@/hooks/api/realstate/useProperyNegotiation'
import usePropertyTypes from '@/hooks/api/realstate/usePropertyTypes'
import useFranchises from '@/hooks/api/realstate/useFranchises'

// Fields Components
import SwitchField from '@components/form/SwitchField'
import NumberField from '@/components/form/NumberField'
import SelectField from '@/components/form/SelectField'
import SelectFieldAsync from '@/components/form/SelectFieldAsync'

// Mui Components


const SellDataTab = ({ control, errors, setValue, getValues }: PropertyTabProps) => {
  const [priceSelldisabled, setPriceSelldisabled] = useState(true)
  const [priceRentdisabled, setPriceRentdisabled] = useState(true)

  const handleEnabledPricesFields = (negotiation: any) => {

    if (negotiation === undefined) {
      setPriceSelldisabled(true)
      setPriceRentdisabled(true)

      return
    }


    // 1: Venta, 2: Alquiler, 3: Venta y Alquiler
    if (negotiation.value == 1) {
      setPriceSelldisabled(false)
      setPriceRentdisabled(true)
    } else if (negotiation.value == 2) {
      setPriceSelldisabled(true)
      setPriceRentdisabled(false)
    } else if (negotiation.value == 3) {
      setPriceSelldisabled(false)
      setPriceRentdisabled(false)
    }
  }

  const switchFields = [
    {
      label: 'Posee Hipoteca',
      name: 'characteristics__has_mortgage',
    },
    {
      label: 'Ficha Catastral Actualizada',
      name: 'characteristics__has_catalog',
    },
    {
      label: 'Vivienda Principal',
      name: 'characteristics__is_principal',
    },
    {
      label: 'Financiamiento',
      name: 'characteristics__has_financing',
    },
    {
      label: 'Forma 33',
      name: 'characteristics__has_33',
    }

  ]
  const selectFields = [
    {
      label: 'Tipo de Propiedad',
      name: 'type_property',
    },
    {
      label: 'Negociación',
      name: 'type_negotiation',
    },
  ]
  const numberFields = [
    {
      label: 'Precio de Venta',
      name: 'initial_price',
    },
    {
      label: 'Precio de Alquiler',
      name: 'rent_price',
    },
  ]

  const {
    data: propertyNegotiations,
    refreshData: refreshPropertyNegotiations,
    fetchData: fetchPropertyNegotiations
  } = usePropertiyNegotiation()

  const { data: propertyTypes, refreshData: refreshPropertyTypes, fetchData: fetchPropertyTypes } = usePropertyTypes()

  useEffect(() => {
    fetchPropertyNegotiations()
    fetchPropertyTypes()
  }, [])


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container size={12} spacing={4}>


        {selectFields.map((field, index) => {
          let response = null
          let refreshData = null
          let onChange = undefined

          if (field.name === 'type_negotiation') {
            response = propertyNegotiations
            refreshData = refreshPropertyNegotiations
            onChange = handleEnabledPricesFields
          } else if (field.name === 'type_property') {
            response = propertyTypes
            refreshData = refreshPropertyTypes
          }

          return (
            <Grid size={{
              md: 6,
              xs: 12
            }} key={index}>
              <SelectFieldAsync
                name={field.name}
                control={control}
                label={field.label}
                error={errors[field.name]}
                setValue={setValue}
                value={getValues(field.name)}
                refreshData={refreshData}
                response={response}
                onChange={onChange}
                dataMap={{ value: 'id', label: 'name' }}
                />
            </Grid>
          )
        })}

        {numberFields.map((field, index) => {
          
          let isDisabled = false

          if (field.name === 'initial_price') {
            isDisabled = priceSelldisabled
          } else if (field.name === 'rent_price') {
            isDisabled = priceRentdisabled
          }

          return (
            <Grid size={{
              md: 6,
              xs: 12
            }} key={index}>
              <NumberField
                name={field.name}
                control={control}
                setValue={setValue}
                error={errors[field.name]}
                label={field.label}
                value={getValues(field.name)}
                integer
                disabled={isDisabled}
              />
            </Grid>
          )
        })}

        {switchFields.map((field, index) => {

          return (
            <Grid size={{
              md: 4,
              xs: 12
            }} key={index}>
              <SwitchField
                label={field.label}
                name={field.name}
                control={control}
                value={getValues(field.name)}
                setValue={setValue}
              />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default SellDataTab
