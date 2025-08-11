import React from 'react'
import { z } from 'zod'
import { Form, FormField } from '@components/common/forms/Form'
import { PageContainer } from '@components/layout/PageContainer'
import { Grid2 } from '@mui/material'

// Schema simple para probar
const testSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  image: z
    .custom<File | null>()
    .refine((file) => {
      if (!file) return true // Allow null/undefined
      if (!(file instanceof File)) return false
      return file.type.startsWith('image/')
    }, {
      message: 'El archivo debe ser una imagen válida'
    }).refine((file) => {
      if (!file) return true // Allow null/undefined
      if (!(file instanceof File)) return false
      return file.size <= 1024 * 1024 * 5 // 5MB limit
    }, {
      message: 'El archivo debe ser menor a 5MB'
    }),
})

type TestFormData = z.infer<typeof testSchema>

const TestImageForm = () => {
  const handleSuccess = (data: TestFormData) => {
    console.log('Test form success:', data)
    console.log('Image value:', data.image)
    console.log('Image type:', typeof data.image)
    console.log('Is File?', data.image instanceof File)
  }

  const handleError = (error: any) => {
    console.error('Test form error:', error)
  }

  const defaultValues: Partial<TestFormData> = {
    name: '',
    image: null,
  }

  return (
    <PageContainer
      title="Test Image Form"
      subtitle="Formulario de prueba para verificar el ImageField"
    >
      <Form
        schema={testSchema}
        defaultValues={defaultValues}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <FormField name='name' label='Nombre' required fullWidth />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <FormField name='image' type='image' label='Imagen de prueba' fullWidth />
          </Grid2>
        </Grid2>
      </Form>
    </PageContainer>
  )
}

export default TestImageForm
