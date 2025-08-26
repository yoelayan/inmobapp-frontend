import { z } from 'zod'

// Schema for PropertyImage component
export const propertyImageSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .optional()
    .default([]),

  currentImageUrls: z
    .array(z.string().url({ message: 'URL de imagen inválida' }))
    .optional()
    .default([])
})

// Schema for image upload response
export const imageUploadResponseSchema = z.object({
  id: z.number(),
  image: z.string().url(),
  order: z.number().optional(),
  parent: z.number()
})

// Schema for multiple image upload response
export const multipleImageUploadResponseSchema = z.object({
  results: z.array(imageUploadResponseSchema),
  total: z.number(),
  page: z.number(),
  page_size: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable()
})

// Default values for PropertyImage
export const defaultPropertyImageValues = {
  images: [],
  currentImageUrls: []
}

// Types
export type PropertyImageFormData = z.infer<typeof propertyImageSchema>
export type ImageUploadResponse = z.infer<typeof imageUploadResponseSchema>
export type MultipleImageUploadResponse = z.infer<typeof multipleImageUploadResponseSchema>
