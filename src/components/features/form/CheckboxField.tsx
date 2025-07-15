// src/components/features/form/CheckBoxField.tsx

import React from 'react'

import { Checkbox, FormControlLabel } from '@mui/material'
import { Controller, type Control } from 'react-hook-form'

interface CheckBoxFieldProps {
  label: string
  name: string
  control: Control<any>
  disabled?: boolean
}

const CheckboxField: React.FC<CheckBoxFieldProps> = ({
  label,
  name,
  control,
  disabled = false
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field: { onChange, value, ...field } }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
            />
          }
          label={label}
        />
      )}
    />
  )
}

export default CheckboxField
