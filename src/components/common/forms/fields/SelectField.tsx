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
        // Handle multiple selection
        const isMultiple = props.SelectProps?.multiple || props.multiple

        // Ensure the value is always defined to prevent controlled/uncontrolled switching
        let fieldValue

        if (isMultiple) {
          // For multiple selection, value should be an array
          const currentValue = field.value as any

          if (Array.isArray(currentValue)) {
            // Filter out any values that don't exist in options
            fieldValue = currentValue.filter((val: string | number | undefined) =>
              options.some(option => option.value === val)
            )
          } else {
            // If not an array, initialize as empty array
            fieldValue = []
          }
        } else {
          // For single selection, value should be a string/number
          const hasValidValue = field.value !== null &&
                               field.value !== undefined &&
            options.some(option => option.value === field.value)

          fieldValue = hasValidValue ? field.value : ''
        }

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
            {!isMultiple && (
              <MenuItem key='placeholder' value='' disabled>
                {placeholder}
              </MenuItem>
            )}
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
