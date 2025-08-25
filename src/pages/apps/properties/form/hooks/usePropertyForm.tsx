import { useRouter } from 'next/navigation'

import { useBaseForm } from '@/hooks/useBaseForm'
import { useNotification } from '@/hooks/useNotification'
import PropertiesRepository from '@services/repositories/realstate/PropertiesRepository'
import useProperties from '@/hooks/api/realstate/useProperties'
import type { IRealProperty } from '@/types/apps/RealtstateTypes'
import { createPropertySchema, editPropertySchema } from '@/validations/propertySchema'

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

    try {
      clearErrors()

      // Get first step fields
      const firstStepData = {
        name: getValues('name'),
        status_id: getValues('status_id'),
        type_property_id: getValues('type_property_id'),
        state_id: getValues('state_id'),
        city_id: getValues('city_id'),
        address: getValues('address')
      }

      // Use Zod schema for validation (partial validation for first step)
      const schema = propertyId ? editPropertySchema : createPropertySchema
      const partialSchema = schema.pick({
        name: true,
        status_id: true,
        type_property_id: true,
        state_id: true,
        city_id: true,
        address: true
      })

      partialSchema.parse(firstStepData)
      return true

    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          setError(err.path[0], {
            type: 'validation',
            message: err.message
          })
        })
      }
      return false
    }
  }

  const validateSecondStep = () => {
    const { setError, clearErrors, getValues } = baseForm

    try {
      clearErrors()

      // Get second step fields
      const secondStepData = {
        franchise_id: getValues('franchise_id'),
        assigned_to_id: getValues('assigned_to_id'),
        type_negotiation_id: getValues('type_negotiation_id'),
        price: getValues('price') || 0,
        rent_price: getValues('rent_price') || 0
      }

      // Use Zod schema for validation (partial validation for second step)
      const schema = propertyId ? editPropertySchema : createPropertySchema
      const partialSchema = schema.pick({
        franchise_id: true,
        assigned_to_id: true,
        type_negotiation_id: true,
        price: true,
        rent_price: true
      })

      partialSchema.parse(secondStepData)

      // Additional validation: at least one price must be set
      if (!secondStepData.price && !secondStepData.rent_price) {
        setError('price', {
          type: 'validation',
          message: 'Debe ingresar un precio de venta o alquiler'
        })
        setError('rent_price', {
          type: 'validation',
          message: 'Debe ingresar un precio de venta o alquiler'
        })
        return false
      }

      return true

    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          setError(err.path[0], {
            type: 'validation',
            message: err.message
          })
        })
      }
      return false
    }
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
