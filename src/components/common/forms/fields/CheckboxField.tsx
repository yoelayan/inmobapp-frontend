import React from 'react'

import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

import { Checkbox, FormControlLabel, FormHelperText, FormGroup } from '@mui/material'

import type { CheckboxFieldProps } from '@/types/common/forms.types'

export const CheckboxField = <T extends FieldValues>({
  name,
  label,
  disabled = false,
  required = false,
  ...props
}: CheckboxFieldProps<T>) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={!!field.value}
                onChange={e => field.onChange(e.target.checked)}
                disabled={disabled}
                required={required}
                color="primary"
                {...props}
              />
            }
            label={label}
          />
          {error && (
            <FormHelperText error>
              {error.message}
            </FormHelperText>
          )}
        </FormGroup>
      )}
    />
  )
}
