import React from 'react'

import { Alert, Grid2 } from '@mui/material'
import type { UseFormReturn } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

import { Form, PageContainer, SelectField, TextField } from '@/components/common/forms/Form'
import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'
import { useNotification } from '@/hooks/useNotification'

import {
  createFranchiseSchema, mappedFranchiseTypes, editFranchiseSchema,
  type CreateFranchiseFormData, type EditFranchiseFormData
} from '@/validations/franchiseSchema'



import type { IFranchise } from '@/types/apps/FranquiciaTypes'



type FranchiseFormProps = {
  mode?: 'create' | 'edit'
  franchiseId?: number,
  onSuccess?: (data: CreateFranchiseFormData | EditFranchiseFormData) => void
}

const FranchiseForm = ({ mode = 'create', franchiseId, onSuccess }: FranchiseFormProps) => {
  const { notify } = useNotification()
  const [initialType, setInitialType] = React.useState<'COMMERCIAL' | 'PERSONAL' | 'MASTER' | undefined>(undefined)
  const schema = mode === 'edit' ? editFranchiseSchema : createFranchiseSchema

  const typeOptions = Object.entries(mappedFranchiseTypes)
    .filter(([value]) => value !== 'MASTER')
    .map(([value, label]) => ({
      value,
      label
    }))


  const defaultValues: Partial<CreateFranchiseFormData> = {
    name: '',
    franchise_type: 'COMMERCIAL',
  }

  const handleSuccess = (data: CreateFranchiseFormData | EditFranchiseFormData) => {
    console.log(data)
    onSuccess?.(data)
  }

  const handleError = (error: any) => {
    console.error(error)
    const errorMessage = error?.response?.data?.detail || error?.message || 'Error al guardar la franquicia'
    
    notify(errorMessage, 'error')
  }

  const setFormData = (data: IFranchise, methods: UseFormReturn<EditFranchiseFormData>) => {
    const formData: EditFranchiseFormData = {
      name: data.name,
      franchise_type: data.franchise_type,
    }

    methods.reset(formData)
    setInitialType(data.franchise_type)
  }

  const FranchiseTypeWarning: React.FC = () => {
    // Only render in edit mode
    if (mode !== 'edit') return null

    // Access form values
    const { watch } = useFormContext<EditFranchiseFormData>()
    const currentType = watch('franchise_type')

    const showWarning = initialType === 'COMMERCIAL' && currentType === 'PERSONAL'

    if (!showWarning) return null

    return (
      <Alert severity='warning'>
        Estás cambiando esta franquicia de Comercial a Personal. Esta acción puede afectar elementos
        relacionados con esta franquicia (por ejemplo: propiedades, clientes, usuarios, asignaciones y
        reportes). Verifica las implicaciones antes de guardar.
      </Alert>
    )
  }

  return (
    <PageContainer title='Franquicia'>
      <Form
        schema={schema}
        defaultValues={defaultValues}
        repository={FranchisesRepository}
        onSuccess={handleSuccess}
        onError={handleError}
        mode={mode}
        entityId={franchiseId}
        setFormData={setFormData}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField name='name' label='Nombre' fullWidth required />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <SelectField
              name='franchise_type'
              label='Tipo de franquicia'
              options={typeOptions}
              fullWidth
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <FranchiseTypeWarning />
          </Grid2>
        </Grid2>
      </Form>
    </PageContainer>
  )
}

export default FranchiseForm
