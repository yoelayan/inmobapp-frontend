import { z } from 'zod'

// Base schema for role data
const baseRoleSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'El nombre del rol debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre del rol debe tener menos de 100 caracteres' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
      message: 'El nombre del rol solo puede contener letras y espacios'
    }),
  permissions: z
    .array(z.string())
    .min(1, { message: 'Debe seleccionar al menos un permiso' })
    .optional()
})

// Schema for creating a new role
export const createRoleSchema = baseRoleSchema

// Schema for editing an existing role
export const editRoleSchema = baseRoleSchema

// Type definitions
export type CreateRoleFormData = z.infer<typeof createRoleSchema>
export type EditRoleFormData = z.infer<typeof editRoleSchema>

// Role status types (if needed later)
export const roleStatus = ['active', 'inactive'] as const
export type RoleStatus = (typeof roleStatus)[number]

export const mappedRoleStatus: { [key in RoleStatus]: string } = {
  active: 'Activo',
  inactive: 'Inactivo'
}

// Default values for forms
export const defaultRoleValues: Partial<CreateRoleFormData> = {
  name: '',
  permissions: []
}
