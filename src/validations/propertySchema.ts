import { z } from 'zod'

import { asyncSelectValidation } from './common'

// Base schema for property data
const basePropertySchema = z.object({
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(255, { message: 'El nombre debe tener menos de 255 caracteres' }),

  description: z.string().optional().or(z.literal('')),

  code: z.string().optional().or(z.literal('')),

  franchise_id: asyncSelectValidation,

  assigned_to_id: asyncSelectValidation,

  status_id: z.number({ message: 'El estado es requerido' }).min(1, { message: 'Debe seleccionar un estado' }),

  type_negotiation_id: z
    .number({ message: 'El tipo de negociación es requerido' })
    .min(1, { message: 'Debe seleccionar un tipo de negociación' }),

  type_property_id: z
    .number({ message: 'El tipo de propiedad es requerido' })
    .min(1, { message: 'Debe seleccionar un tipo de propiedad' }),

  price: z.coerce.number().min(0.01, { message: 'El precio debe ser mayor a 0' }).optional(),

  rent_price: z.coerce.number().min(0.01, { message: 'El precio de alquiler debe ser mayor a 0' }).optional(),

  state_id: asyncSelectValidation,

  municipality_id: asyncSelectValidation,

  parish_id: asyncSelectValidation,

  address: z
    .string()
    .min(5, { message: 'La dirección debe tener al menos 5 caracteres' })
    .max(255, { message: 'La dirección debe tener menos de 255 caracteres' })
    .optional()
    .or(z.literal('')),

  owner_id: asyncSelectValidation,

  characteristics: z
    .array(
      z.object({
        characteristic_id: z.number(),
        value: z.union([z.string(), z.number(), z.boolean()])
      })
    )
    .optional()
})

// Schema for creating properties - Solo se usa al completar paso 2
export const createPropertySchema = basePropertySchema.omit({
  characteristics: true
})

// Schema for editing properties
export const editPropertySchema = basePropertySchema.partial().extend({
  id: z.number().optional()
})

// Partial schemas for step validation - NO bloquean el avance, solo muestran errores
export const step1PartialSchema = basePropertySchema.pick({
  name: true,
  code: true,
  status_id: true,
  type_property_id: true,
  state_id: true,
  municipality_id: true,
  parish_id: true,
  address: true
}).partial()

export const step2PartialSchema = basePropertySchema.pick({
  franchise_id: true,
  assigned_to_id: true,
  type_negotiation_id: true,
  price: true,
  rent_price: true,
  owner_id: true
}).partial()

// Step-specific schemas for validation
export const step1Schema = z.object({
  name: basePropertySchema.shape.name,
  code: basePropertySchema.shape.code,
  status_id: basePropertySchema.shape.status_id,
  type_property_id: basePropertySchema.shape.type_property_id,
  state_id: basePropertySchema.shape.state_id,
  municipality_id: basePropertySchema.shape.municipality_id,
  parish_id: basePropertySchema.shape.parish_id,
  address: basePropertySchema.shape.address
})

export const step2Schema = z.object({
  franchise_id: basePropertySchema.shape.franchise_id,
  assigned_to_id: basePropertySchema.shape.assigned_to_id,
  type_negotiation_id: basePropertySchema.shape.type_negotiation_id,
  price: basePropertySchema.shape.price,
  rent_price: basePropertySchema.shape.rent_price,
  owner_id: basePropertySchema.shape.owner_id
}).superRefine((data, ctx) => {
  // Validación condicional basada en el tipo de negociación
  if (data.type_negotiation_id === 1) { // Solo Venta
    if (!data.price || data.price <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El precio de venta es requerido',
        path: ['price']
      })
    }
  } else if (data.type_negotiation_id === 2) { // Solo Alquiler
    if (!data.rent_price || data.rent_price <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El precio de alquiler es requerido',
        path: ['rent_price']
      })
    }
  } else if (data.type_negotiation_id === 3) { // Venta y Alquiler
    // Para venta y alquiler, al menos uno debe estar presente
    if ((!data.price || data.price <= 0) && (!data.rent_price || data.rent_price <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debe especificar al menos un precio (venta o alquiler)',
        path: ['price']
      })
    }
  }
})

export const step3Schema = z.object({
  characteristics: basePropertySchema.shape.characteristics
})

// Default values for form - No enviar valores 0
export const defaultPropertyValues = {
  name: '',
  description: '',
  code: '',
  franchise_id: undefined,
  assigned_to_id: undefined,
  status_id: undefined,
  type_negotiation_id: undefined,
  type_property_id: undefined,
  price: undefined, // Cambiado de 0 a undefined
  rent_price: undefined, // Cambiado de 0 a undefined
  state_id: undefined,
  municipality_id: undefined,
  parish_id: undefined,
  address: '',
  owner_id: undefined,
  characteristics: []
}

export type CreatePropertyFormData = z.infer<typeof createPropertySchema>
export type EditPropertyFormData = z.infer<typeof editPropertySchema>
