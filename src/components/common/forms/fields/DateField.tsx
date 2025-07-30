// components/forms/fields/DateField.tsx
import React from 'react'

import type { FieldValues } from 'react-hook-form'

import { Controller, useFormContext } from 'react-hook-form'

import { TextField as MUITextField } from '@mui/material'

import type { DateFieldProps } from '@/types/common/forms.types'



export const DateField = <T extends FieldValues>({
  name,
  label,
  disabled = false,
  required = false,
  disablePast = false,
  disableFuture = false,
  ...props
}: DateFieldProps<T>) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <MUITextField
          {...field}
      label={label}
      type='date'
      disabled={disabled}
      required={required}
      error={!!error}
      helperText={error?.message}
      fullWidth
      variant='outlined'
      slotProps={{
        inputLabel: {
          shrink: true
        },
        htmlInput: {
          min: disablePast ? new Date().toISOString().split('T')[0] : undefined,
          max: disableFuture ? new Date().toISOString().split('T')[0] : undefined
        }
      }}
      {...props}
      />
    )}
    />
  )
}
