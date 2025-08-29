import { z } from 'zod'

// Base schema for search data
const baseSearchSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'La descripción es requerida' })
    .max(1000, { message: 'La descripción debe tener menos de 1000 caracteres' }),

  budget: z.union([
    z.string().min(1, { message: 'El presupuesto es requerido' }),
    z.number().min(0.01, { message: 'El presupuesto debe ser mayor a 0' })
  ]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val)
      if (isNaN(num) || num <= 0) {
        throw new Error('El presupuesto debe ser un número válido mayor a 0')
      }
      return num
    }
    return val
  })
})

// Schema for creating searches (cliente requerido)
export const createSearchSchema = baseSearchSchema.extend({
  client_id: z.union([
    z.number().min(1, { message: 'Debe seleccionar un cliente' }),
    z.object({
      value: z.number().min(1, { message: 'Debe seleccionar un cliente' }),
      label: z.string()
    })
  ]).transform((val) => {
    if (typeof val === 'object' && val !== null) {
      return val.value
    }
    return val
  })
})

// Schema for editing searches (todos los campos opcionales)
export const editSearchSchema = baseSearchSchema.partial().extend({
  client_id: z.union([
    z.number().min(1, { message: 'El cliente debe ser válido' }),
    z.object({
      value: z.number().min(1, { message: 'El cliente debe ser válido' }),
      label: z.string()
    }),
    z.undefined()
  ]).transform((val) => {
    if (typeof val === 'object' && val !== null) {
      return val.value
    }
    return val
  }).optional()
})

// Types
export type CreateSearchFormData = z.infer<typeof createSearchSchema>
export type EditSearchFormData = z.infer<typeof editSearchSchema>
