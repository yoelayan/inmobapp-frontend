import { z } from 'zod'

const roles = ['admin', 'user'] as const
const status = ['active', 'inactive'] as const

export type Roles = (typeof roles)[number]
export type Status = (typeof status)[number]

export const mappedRoles: { [key in Roles]: string } = {
  admin: 'Administrador',
  user: 'Usuario'
}

// Base schema for user data
const baseUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre debe tener menos de 50 caracteres' }),
  email: z.string().email({ message: 'El email no es válido' }),

  image: z
    .custom<File | null>()
    .optional()
    .nullable()
    .refine(
      file => {
        if (!file) return true // Allow null/undefined
        if (!(file instanceof File)) return false

        return file.type.startsWith('image/')
      },
      {
        message: 'El archivo debe ser una imagen válida'
      }
    )
    .refine(
      file => {
        if (!file) return true // Allow null/undefined
        if (!(file instanceof File)) return false

        return file.size <= 1024 * 1024 * 5 // 5MB limit
      },
      {
        message: 'El archivo debe ser menor a 5MB'
      }
    ),
  franchise_id: z.number({ message: 'La franquicia no es válida' }),
  groups: z
    .array(z.union([z.string(), z.number()]))
    .transform(arr => arr.map(item => (typeof item === 'string' ? parseInt(item, 10) : item)))
    .optional(),
  user_permissions: z.array(z.string()).optional()
})

// Schema for creating users (passwords required)
export const userSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .max(20, { message: 'La contraseña debe tener menos de 20 caracteres' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .max(20, { message: 'La contraseña debe tener menos de 20 caracteres' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

// Schema for editing users (passwords optional)
export const editUserSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val.trim() === '') return true

        return val.length >= 8
      }, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .refine((val) => {
        if (!val || val.trim() === '') return true

        return val.length <= 20
      }, { message: 'La contraseña debe tener menos de 20 caracteres' }),

    confirmPassword: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val.trim() === '') return true

        return val.length >= 8
      }, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .refine((val) => {
        if (!val || val.trim() === '') return true

        return val.length <= 20
      }, { message: 'La contraseña debe tener menos de 20 caracteres' }),
  })
  .refine(
    data => {
      // Only validate password match if passwords are provided
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword
      }

      return true
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword']
    }
  )

export type CreateUserFormData = z.infer<typeof userSchema>
export type EditUserFormData = z.infer<typeof editUserSchema>
