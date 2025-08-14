import { z } from 'zod'

// Base schema for property data
const basePropertySchema = z.object({
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(255, { message: 'El nombre debe tener menos de 255 caracteres' }),

  description: z
    .string()
    .optional()
    .or(z.literal('')),

  code: z
    .string()
    .optional()
    .or(z.literal('')),

    franchise_id: z
    .number({ message: 'La franquicia es requerida' })
    .min(1, { message: 'Debe seleccionar una franquicia' }),

  assigned_to_id: z
    .number({ message: 'El usuario asignado es requerido' })
    .min(1, { message: 'Debe seleccionar un usuario' }),

  status_id: z
    .number({ message: 'El estado es requerido' })
    .min(1, { message: 'Debe seleccionar un estado' }),

  type_negotiation_id: z
    .number({ message: 'El tipo de negociación es requerido' })
    .min(1, { message: 'Debe seleccionar un tipo de negociación' }),

  type_property_id: z
    .number({ message: 'El tipo de propiedad es requerido' })
    .min(1, { message: 'Debe seleccionar un tipo de propiedad' }),

  price: z
    .coerce.number()
    .min(0, { message: 'El precio debe ser mayor o igual a 0' })
    .default(0),

  initial_price: z
    .coerce.number()
    .min(0, { message: 'El precio inicial debe ser mayor o igual a 0' }),

  rent_price: z
    .coerce.number()
    .min(0, { message: 'El precio de alquiler debe ser mayor o igual a 0' })
    .default(0),

    state_id: z
    .number({ message: 'El estado es requerido' })
    .min(1, { message: 'Debe seleccionar un estado' }),

  city_id: z
    .number({ message: 'La ciudad es requerida' })
    .min(1, { message: 'Debe seleccionar una ciudad' }),

  address: z
    .string()
    .min(5, { message: 'La dirección debe tener al menos 5 caracteres' })
    .max(255, { message: 'La dirección debe tener menos de 255 caracteres' }),

  owner_id: z
    .number({ message: 'El propietario es requerido' })
    .optional()
    .nullable()
    .or(z.literal(0)),

  characteristics: z
    .array(z.object({
      characteristic_id: z.number(),
      value: z.union([z.string(), z.number(), z.boolean()])
    }))
    .optional(),

  images: z
    .array(z.object({
      id: z.number().optional(),
      image: z.string().optional(),
      order: z.number().optional(),
      preview: z.any().optional()
    }))
    .optional()
})

// Schema for creating properties
export const createPropertySchema = basePropertySchema

// Schema for editing properties
export const editPropertySchema = basePropertySchema.partial().extend({
  id: z.number().optional()
})

// Step-specific schemas for validation
export const step1Schema = z.object({
  name: basePropertySchema.shape.name,
  code: basePropertySchema.shape.code,
  status_id: basePropertySchema.shape.status_id,
  type_property_id: basePropertySchema.shape.type_property_id,
  state_id: basePropertySchema.shape.state_id,
  city_id: basePropertySchema.shape.city_id,
  address: basePropertySchema.shape.address
})

export const step2Schema = z.object({
  franchise_id: basePropertySchema.shape.franchise_id,
  assigned_to_id: basePropertySchema.shape.assigned_to_id,
  type_negotiation_id: basePropertySchema.shape.type_negotiation_id,
  initial_price: basePropertySchema.shape.initial_price,
  price: basePropertySchema.shape.price,
  rent_price: basePropertySchema.shape.rent_price,
  owner_id: basePropertySchema.shape.owner_id
})

export const step3Schema = z.object({
  characteristics: basePropertySchema.shape.characteristics,
  images: basePropertySchema.shape.images
})

// Default values for form
export const defaultPropertyValues = {
  name: '',
  description: '',
  code: '',
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
  address: '',
  owner_id: undefined,
  characteristics: [],
  images: []
}

export type CreatePropertyFormData = z.infer<typeof createPropertySchema>
export type EditPropertyFormData = z.infer<typeof editPropertySchema>
