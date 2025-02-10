// React imports
import { useState } from 'react'

import { Switch, FormControlLabel, FormHelperText } from '@mui/material'
import { Controller } from 'react-hook-form'

import type FieldProps from '@/components/form/BaseField'

interface SwitchFieldProps extends FieldProps {
  onChange?: (value: any) => void
}

const SwitchField = ({ value, label, name, onChange, control, error, setValue }: SwitchFieldProps) => {
  const [checked, setChecked] = useState(value || false)

  const handleChange = (value: boolean) => {
    setChecked(value)
    setValue(name, value)

    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <FormControlLabel
            control={
              <Switch
                {...field}
                checked={checked}
                onChange={e => {
                  handleChange(e.target.checked)
                }}
              />
            }
            label={label}
          />
          {error && <FormHelperText error>{error?.message}</FormHelperText>}
        </>
      )}
    />
  )
}

export default SwitchField
