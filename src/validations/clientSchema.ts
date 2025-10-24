import { z } from 'zod'

import { asyncSelectValidation } from './common'


// Esquema para crear un cliente
export const createClientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El email debe ser válido').optional().or(z.literal('')),
  phone: z.string().min(1, 'El teléfono es requerido'),
  status: z.number().min(1, 'El status es requerido'),
  franchise_id: asyncSelectValidation.optional().nullable(),
  assigned_to_id: asyncSelectValidation.optional().nullable(),
})




// Esquema para editar un cliente
export const editClientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El email debe ser válido').optional().or(z.literal('')),
  phone: z.string().min(1, 'El teléfono es requerido'),
  status: z.number().min(1, 'El status es requerido'),
  franchise_id: asyncSelectValidation.optional().nullable(),
  assigned_to_id: asyncSelectValidation.optional().nullable(),
})

// Valores por defecto para el formulario
export const defaultClientValues = {
  name: '',
  email: '',
  phone: '',
  status: undefined,
  franchise_id: undefined,
  assigned_to_id: undefined,
}

// Tipos TypeScript
export type CreateClientFormData = z.infer<typeof createClientSchema>
export type EditClientFormData = z.infer<typeof editClientSchema>
