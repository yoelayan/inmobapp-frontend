// components/forms/fields/TextField.tsx
import React from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import type { FieldValues } from 'react-hook-form'

import { TextField as MUITextField, type TextFieldProps as MUITextFieldProps } from '@mui/material'

import type { TextFieldProps } from '@/types/common/forms.types'



export const TextField = <T extends FieldValues, V extends MUITextFieldProps>({
  name,
  label,
  type = 'text',
  placeholder,
  multiline = false,
  rows = 1,
  disabled = false,
  required = false,
  ...props
}: TextFieldProps<T> & V) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <MUITextField
          {...field}
          value={field.value ?? ''}
          label={label}
          type={type}
          placeholder={placeholder}
          multiline={multiline}
          rows={multiline ? rows : 1}
          disabled={disabled}
          required={required}
          error={!!error}
          helperText={error?.message}
          variant='outlined'
          {...props}
        />
      )}
    />
  )
}
