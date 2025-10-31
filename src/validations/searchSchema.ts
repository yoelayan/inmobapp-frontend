import { z } from 'zod'

import { asyncSelectValidation } from './common'

// Base schema for search data
const baseSearchSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'La descripción es requerida' })
    .max(1000, { message: 'La descripción debe tener menos de 1000 caracteres' }),

  budget: z.coerce.number().min(0.01, { message: 'El presupuesto debe ser mayor a 0' })
})

// Schema for creating searches (cliente requerido)
export const createSearchSchema = baseSearchSchema.extend({
  client_id: asyncSelectValidation,
  state_id: asyncSelectValidation.optional().nullable(),
  municipality_id: asyncSelectValidation.optional().nullable(),
  parish_id: asyncSelectValidation.optional().nullable()
})

// Schema for editing searches (todos los campos opcionales)
export const editSearchSchema = baseSearchSchema.extend({
  client_id: asyncSelectValidation,
  state_id: asyncSelectValidation.optional().nullable(),
  municipality_id: asyncSelectValidation.optional().nullable(),
  parish_id: asyncSelectValidation.optional().nullable()
})

export const defaultSearchValues = {
  description: '',
  budget: 0.01,
  client_id: undefined,
  state_id: undefined,
  municipality_id: undefined,
  parish_id: undefined
}

// Types
export type CreateSearchFormData = z.infer<typeof createSearchSchema>
export type EditSearchFormData = z.infer<typeof editSearchSchema>
