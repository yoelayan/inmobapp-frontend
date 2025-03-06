import { useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'

import { IRealProperty } from '@/types/apps/RealtstateTypes'

type SelectField = {
  value: number
  label: string
}

type RealPropertyForm = {
  name: string
  description: string
  images: Array<File | string>
  status_id?: number
  type_property_id?: number
  type_negotiation_id?: number
  state_id?: number
  city_id?: number
  status: SelectField
  type_property: SelectField
  type_negotiation: SelectField
  state: SelectField
  city: SelectField
  initial_price: number
  rent_price: number
  characteristics__has_mortgage: boolean
  characteristics__has_catalog: boolean
  characteristics__is_principal: boolean
  characteristics__has_financing: boolean
  characteristics__has_33: boolean
  assigned_to: any
  address: string
  characteristics__mts2: number
  characteristics__mts2_build: number
  characteristics__floors: number
  characteristics__rooms: number
  characteristics__bathrooms: number
  characteristics__service_bathrooms: number
  characteristics__service_rooms: number
  characteristics__parking_spots: number
  characteristics__has_living_room: boolean
  characteristics__has_studio: boolean
  characteristics__has_garden: boolean
  characteristics__has_washer: boolean
  characteristics__has_garage: boolean
  characteristics__has_water_tank: boolean
  characteristics__has_electric_plant: boolean
  characteristics__has_elevator: boolean
  characteristics__has_private_security: boolean
  characteristics__has_playground: boolean
  characteristics__has_swimming_pool: boolean
  characteristics__has_gym: boolean
  characteristics__has_grill: boolean
  characteristics__has_party_room: boolean
  characteristics__has_sports_field: boolean
  characteristics__has_deep_well: boolean
  characteristics__has_common_electric_plant: boolean

}

const getFormattedValues = async (values: RealPropertyForm) => {

  // los valores que empiecen por characteristics formatearlo dentro de un objeto
  // characteristics: []
  // {code: name_field, value: value_field}
  const characteristics = Object.keys(values)
    .filter(key => key.startsWith('characteristics__'))
    .reduce((obj, key) => {
      const newKey = key.replace('characteristics__', '')
      obj.push({ code: newKey, value: values[key as keyof RealPropertyForm] })

      return obj
    }, [] as any[])
  // eliminar los characteristics
  const keysToRemove = Object.keys(values).filter(key => key.startsWith('characteristics__'))
  keysToRemove.forEach(key => delete values[key as keyof RealPropertyForm])
  
  /**
   * status_inmueble
    type_property
    type_negotiation
    state
    city
    obtener el value del select
   */
    
  values.status_id = values.status.value
  values.type_property_id = values.type_property.value
  values.type_negotiation_id = values.type_negotiation.value
  values.state_id = values.state.value
  values.city_id = values.city.value

  // remove
  delete values.status
  delete values.type_property
  delete values.type_negotiation
  delete values.state
  delete values.city



  
  return {
    ...values,
    characteristics: characteristics
  }
}

const usePropertyForm = (defaultValues?: RealPropertyForm) => {
  const initValues = {
    name: '',
    status: null,
    description: '',
    type_property: null,
    type_negotiation: null,
    initial_price: 0,
    rent_price: 0, 
    state: null,
    city: null,
    address: '',
    assigned_to: null,
    characteristics__has_mortgage: false,
    characteristics__has_catalog: false,
    characteristics__is_principal: false,
    characteristics__has_financing: false,
    characteristics__has_33: false,
    characteristics__mts2: 0,
    characteristics__mts2_build: 0,
    characteristics__floors: 0,
    characteristics__rooms: 0,
    characteristics__bathrooms: 0,
    characteristics__service_bathrooms: 0,
    characteristics__service_rooms: 0,
    characteristics__parking_spots: 0,
    characteristics__has_living_room: false,
    characteristics__has_studio: false,
    characteristics__has_garden: false,
    characteristics__has_washer: false,
    characteristics__has_garage: false,
    characteristics__has_water_tank: false,
    characteristics__has_electric_plant: false,
    characteristics__has_elevator: false,
    characteristics__has_private_security: false,
    characteristics__has_playground: false,
    characteristics__has_swimming_pool: false,
    characteristics__has_gym: false,
    characteristics__has_grill: false,
    characteristics__has_party_room: false,
    characteristics__has_sports_field: false,
    characteristics__has_deep_well: false,
    characteristics__has_common_electric_plant: false,
    images: []
  }

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues])


  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues
  } = useForm<RealPropertyForm>({
    defaultValues: initValues
  })

    

  return {
    control,
    reset,
    handleSubmit,
    errors,
    setError,
    setValue,
    getValues,
    getFormattedValues: () => getFormattedValues(getValues())
  }
}

export default usePropertyForm
