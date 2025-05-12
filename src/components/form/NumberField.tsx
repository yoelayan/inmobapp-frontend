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
  const [inputValue, setInputValue] = useState(value !== undefined && value !== null ? value : 0)

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInputValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value)

    if (integer) {
      newValue = Math.floor(newValue)
    }

    setInputValue(newValue)
    setValue(name, newValue)
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
