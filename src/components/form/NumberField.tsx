// React Imports
import React, { useEffect, useState } from 'react'

import { Controller } from 'react-hook-form'

import type FieldProps from '@/components/form/BaseField'

// MUI Imports
import CustomTextField from '@core/components/mui/TextField'

interface NumberFieldProps extends FieldProps {
  integer?: boolean
}

const NumberField = ({ name, control, label, error, value, setValue, integer, disabled }: NumberFieldProps) => {
  const [inputValue, setInputValue] = useState(0)

  useEffect(() => {
    setInputValue(value || 0)
    setValue(name, value || 0)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    value = Number(e.target.value)

    if (integer) {
      value = Math.floor(value)
    }

    setInputValue(value)
    setValue(name, value)
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CustomTextField
          {...field}
          onChange={handleChange}
          value={inputValue}
          fullWidth
          label={label}
          error={!!error}
          helperText={error?.message}
          type='number'
          inputProps={{
            step: 1
          }}
          disabled={disabled}
        />
      )}
    />
  )
}

export default NumberField
