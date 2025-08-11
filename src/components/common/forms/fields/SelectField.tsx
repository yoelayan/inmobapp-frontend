// components/forms/fields/SelectField.tsx
import React from 'react'

import type { FieldValues } from 'react-hook-form'

import { Controller, useFormContext } from 'react-hook-form'

import { TextField as MUITextField, MenuItem, type TextFieldProps as MUITextFieldProps } from '@mui/material'

import type { SelectFieldProps } from '@/types/common/forms.types'





export const SelectField = <T extends FieldValues, V extends MUITextFieldProps>({
  name,
  label,
  options,
  placeholder = 'Selecciona una opción',
  disabled = false,
  required = false,
  ...props
}: SelectFieldProps<T> & V) => {
  const { control } = useFormContext()


  return (
        <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        // Ensure the value is always defined to prevent controlled/uncontrolled switching
        const fieldValue = field.value === null || field.value === undefined ? '' : field.value

        return (
          <MUITextField
            {...field}
            value={fieldValue}
            select
            label={label}
            disabled={disabled}
            required={required}
            error={!!error}
            helperText={error?.message}
            variant='outlined'
            slotProps={{
              inputLabel: {
                shrink: true
              },
            }}
            {...props}
          >
            <MenuItem key='placeholder' value='' disabled selected={fieldValue === ''}>
              {placeholder}
            </MenuItem>
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </MUITextField>
        )}}
    />
  )
}
