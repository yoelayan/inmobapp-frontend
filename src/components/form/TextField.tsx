// React imports
import React from 'react'

import { Controller } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'

import type FieldProps from '@/components/form/BaseField'

interface TextFieldProps extends FieldProps {
  onChange?: (value: any) => void
}

const TextField = ({ value, label, name, onChange, control, error, setValue, disabled }: TextFieldProps) => {
  // No necesitamos mantener un estado interno duplicado
  // El valor se puede usar directamente desde el prop value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    setValue(name, newValue)

    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // Override the field props we need to customize
        return (
          <CustomTextField
            {...field}
            inputRef={field.ref}
            fullWidth

            // Override these props specifically
            value={value ?? ''}
            onChange={handleChange}
            label={label}
            error={!!error}
            helperText={error?.message}
            disabled={disabled}
          />
        )
      }}
    />
  )
}

export default TextField
