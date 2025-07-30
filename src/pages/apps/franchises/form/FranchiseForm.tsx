import React from 'react'

import { Grid2 } from '@mui/material'
import type { UseFormReturn } from 'react-hook-form'

import { Form, PageContainer, SelectField, TextField } from '@/components/common/forms/Form'
import FranchisesRepository from '@/services/repositories/realstate/FranchisesRepository'

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
  }

  const setFormData = (data: IFranchise, methods: UseFormReturn<EditFranchiseFormData>) => {
    const formData: EditFranchiseFormData = {
      name: data.name,
      franchise_type: data.franchise_type,
    }

    methods.reset(formData)
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
        </Grid2>
      </Form>
    </PageContainer>
  )
}

export default FranchiseForm
