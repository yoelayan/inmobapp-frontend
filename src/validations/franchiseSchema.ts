import { z } from 'zod'

//COMMERCIAL: Commercial
//PERSONAL: Personal

const franchiseTypes = ['MASTER', 'COMMERCIAL', 'PERSONAL'] as const

export type FranchiseTypes = (typeof franchiseTypes)[number]

export const mappedFranchiseTypes: { [key in FranchiseTypes]: string } = {
  MASTER: 'Master',
  COMMERCIAL: 'Comercial',
  PERSONAL: 'Personal'
}

export const createFranchiseSchema = z.object({
  franchise_type: z.enum(franchiseTypes, { message: 'El tipo de franquicia no es válido' }),
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre debe tener menos de 50 caracteres' }),
})

export const editFranchiseSchema = z.object({
  franchise_type: z.enum(franchiseTypes, { message: 'El tipo de franquicia no es válido' }).optional(),
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre debe tener menos de 50 caracteres' })
    .optional()
})

export type CreateFranchiseFormData = z.infer<typeof createFranchiseSchema>
export type EditFranchiseFormData = z.infer<typeof editFranchiseSchema>
