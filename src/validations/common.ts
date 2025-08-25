import { z } from 'zod'



export const asyncSelectValidation = z
  .object({
    label: z.string(),
    value: z.number()
  })
  .refine(data => data.value !== undefined, {
    message: 'El valor es requerido'
  }).describe('AsyncSelectValidation')

export type AsyncSelectValidation = z.infer<typeof asyncSelectValidation>

// verificar si el campo es del tipo asyncSelectValidation usando el describe
export const isAsyncSelectField = (schema: z.ZodTypeAny): boolean => {
  // si no tiene description, retornar false
  if (!schema?.description) return false

  return schema.description === 'AsyncSelectValidation'
}


