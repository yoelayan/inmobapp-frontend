import { useRouter } from 'next/navigation'

import { useBaseForm } from '@/hooks/useBaseForm'
import { useNotification } from '@/hooks/useNotification'
import PropertiesRepository from '@services/repositories/realstate/PropertiesRepository'
import useProperties from '@/hooks/api/realstate/useProperties'
import type { IRealProperty } from '@/types/apps/RealtstateTypes'

// Define los valores iniciales del formulario
const defaultPropertyValues: Partial<IRealProperty> = {
  name: '',
  code: '',
  description: '',
  franchise_id: undefined,
  assigned_to_id: undefined,
  status_id: undefined,
  type_negotiation_id: undefined,
  type_property_id: undefined,
  price: 0,
  initial_price: 0,
  rent_price: 0,
  state_id: undefined,
  city_id: undefined,
  owner_id: undefined,
  address: '',
  images: [],
  characteristics: []
}

// Transforma los datos del backend para que sean compatibles con el formulario
const transformPropertyDataForForm = (property: IRealProperty): Partial<IRealProperty> => {
  return {
    ...property
  }
}

export const usePropertyForm = (propertyId?: string) => {
  const notificationHook = useNotification()
  const router = useRouter()

  const onSuccess = (response: IRealProperty, isUpdate: boolean) => {
    if (!isUpdate) {
      notificationHook.notify('Se ha creado la propiedad', 'info')
      router.push(`/propiedades/${response.id}`)
    }
  }

  // Usa el hook base para manejar la lógica del formulario
  const baseForm = useBaseForm<IRealProperty, Partial<IRealProperty>, string>({
    id: propertyId,
    repository: PropertiesRepository, // Repositorio para manejar las propiedades
    defaultValues: defaultPropertyValues,
    transformDataForForm: transformPropertyDataForForm,
    notificationHook,
    onSuccess: onSuccess
  })

  const { uploadImages } = useProperties()

  const validateFirstStep = () => {
    const { setError, clearErrors, getValues } = baseForm
    const name = getValues('name')
    const status_id = getValues('status_id')
    const type_property_id = getValues('type_property_id')
    const state_id = getValues('state_id')
    const city_id = getValues('city_id')
    const address = getValues('address')
    const characteristics = getValues('characteristics')

    const fields = {
      name,
      status_id,
      type_property_id,
      state_id,
      city_id,
      address,
      characteristics
    }

    let isValid = true

    clearErrors()

    for (const field in fields) {
      if (!fields[field as keyof typeof fields]) {
        setError(field as keyof typeof fields, {
          type: 'required',
          message: 'Este campo es requerido'
        })
        isValid = false
      }
    }

    return isValid
  }

  const validateSecondStep = () => {
    const { setError, clearErrors, getValues } = baseForm
    const franchise_id = getValues('franchise_id')

    const assigned_to_id = getValues('assigned_to_id')
    const type_negotiation_id = getValues('type_negotiation_id')
    const owner_id = getValues('owner_id')
    const price = getValues('price')
    const rent_price = getValues('rent_price')

    const fields = {
      assigned_to_id,
      franchise_id,
      type_negotiation_id,
      owner_id
    }

    let isValid = true

    clearErrors()

    for (const field in fields) {
      if (!fields[field as keyof typeof fields]) {
        setError(field as keyof typeof fields, {
          type: 'required',
          message: 'Este campo es requerido'
        })
        isValid = false
      }
    }

    if (!price && !rent_price) {
      setError('price', {
        type: 'required',
        message: 'Debe ingresar un precio de venta o alquiler'
      })
      setError('rent_price', {
        type: 'required',
        message: 'Debe ingresar un precio de venta o alquiler'
      })
      isValid = false
    }

    return isValid
  }

  const handleChangeImages = async (value: any) => {
    console.log('subiendo')

    if (!propertyId) {
      notificationHook.notify('Debe guardar la propiedad antes de subir imagenes', 'warning')

      return
    }

    return await uploadImages(propertyId, value)
  }

  return { baseForm, validateFirstStep, validateSecondStep, handleChangeImages }
}
