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
import SwitchFieldProps from '@components/form/SwitchField'
import NumberField from '@/components/form/NumberField'
import SelectField from '@/components/form/SelectField'
import SelectFieldAsync from '@/components/form/SelectFieldAsync'

// Mui Components


const SellDataTab = ({ control, errors, setValue, getValues }: PropertyTabProps) => {
  const [priceSelldisabled, setPriceSelldisabled] = useState(true)
  const [priceRentdisabled, setPriceRentdisabled] = useState(true)

  const handleEnabledPricesFields = (negotiation: any) => {
    console.log(negotiation)

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

    console.log(priceSelldisabled, priceRentdisabled)
  }

  const {
    data: propertyNegotiations,
    refreshData: refreshPropertyNegotiations,
    fetchData: fetchPropertyNegotiations
  } = usePropertiyNegotiation()

  const { data: propertyTypes, refreshData: refreshPropertyTypes, fetchData: fetchPropertyTypes } = usePropertyTypes()
  const { data: franchises, refreshData: refreshFranchises, fetchData: fetchFranchises } = useFranchises()

  useEffect(() => {
    fetchPropertyNegotiations()
    fetchPropertyTypes()
    fetchFranchises()
  }, [])

  const renderSwichts = () => {
    const switchs = [
      { name: 'poseeHipoteca', label: 'Posee Hipoteca' },
      { name: 'fichaCatastral', label: 'Ficha Catastral Actualizada' },
      { name: 'viviendaPrincipal', label: 'Vivienda Principal' },
      { name: 'financiamiento', label: 'Financiamiento' },
      { name: 'forma33', label: 'Forma 33' }
    ]
    
return switchs.map((item: any) => {
      return (
        <Grid size={12} key={item.name}>
          <SwitchFieldProps
            label={item.label}
            name={item.name}
            control={control}
            value={getValues(item.name)}
            setValue={setValue}
          />
        </Grid>
      )
    })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container size={12} spacing={4}>
        <Grid container size={8}>
          <Grid size={12} container spacing={2}>
            <Grid size={6}>
              <SelectFieldAsync
                name='tipoPropiedad'
                control={control}
                label='Tipo Propiedad'
                error={errors.tipoPropiedad}
                setValue={setValue}
                value={getValues('tipoPropiedad')}
                refreshData={refreshPropertyTypes}
                response={propertyTypes}
                dataMap={{ value: 'id', label: 'nombre' }}
              />
            </Grid>
            <Grid size={6}>
              <SelectFieldAsync
                name='franquicia'
                control={control}
                label='Franquicia'
                error={errors.franquicia}
                setValue={setValue}
                value={getValues('franquicia')}
                refreshData={refreshFranchises}
                response={franchises}
                dataMap={{ value: 'id', label: 'nombre' }}
              />
            </Grid>
          </Grid>
          <Grid size={12} container className='mt-4' spacing={2}>
            <Grid size={4}>
              <SelectField
                name='negociacion'
                control={control}
                label='Negociación'
                error={errors.negociacion}
                value={getValues('negociacion')}
                setValue={setValue}
                response={propertyNegotiations}
                dataMap={{ value: 'id', label: 'nombre' }}
                onChange={handleEnabledPricesFields}
              />
            </Grid>
            <Grid size={4}>
              <NumberField
                name='precioVenta'
                control={control}
                label='Precio de Venta'
                error={errors.precioVenta}
                value={getValues('precioVenta')}
                setValue={setValue}
                disabled={priceSelldisabled}
              />
            </Grid>
            <Grid size={4}>
              <NumberField
                name='precioAlquiler'
                control={control}
                label='Precio de Alquiler'
                error={errors.precioAlquiler}
                value={getValues('precioAlquiler')}
                setValue={setValue}
                disabled={priceRentdisabled}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={4}>
          <Box sx={{ flexGrow: 1 }} className='mt-4'>
            {renderSwichts()}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SellDataTab
