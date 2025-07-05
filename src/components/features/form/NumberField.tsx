// React Imports
import React, { useState } from 'react'

import { Controller } from 'react-hook-form'

import type FieldProps from '@/components/features/form/BaseField'

// MUI Imports
import CustomTextField from '@core/components/mui/TextField'

interface NumberFieldProps extends FieldProps {
  integer?: boolean
}

const NumberField = ({ name, control, label, error, setValue, value, integer, disabled }: NumberFieldProps) => {
  const [inputValue, setInputValue] = useState(value !== undefined && value !== null ? value : '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value

    let newValue = 0

    if (integer) {
      newValue = Math.floor(Number(inputVal))
    } else {
      newValue = Number(inputVal)
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
          fullWidth
          label={label}
          error={!!error}
          helperText={error?.message}
          type='number'
          inputProps={{
            step: 1
          }}
          disabled={disabled}
          value={inputValue}
        />
      )}
    />
  )
}

export default NumberField
