// React imports
import { useState } from 'react'
import CustomTextField from '@core/components/mui/TextField'
import { Controller } from 'react-hook-form'

import type FieldProps from '@/components/form/BaseField'

interface TextFieldProps extends FieldProps {
  onChange?: (value: any) => void
}

const TextField = ({ value, label, name, onChange, control, error, setValue }: TextFieldProps) => {
    const [inputValue, setInputValue] = useState(value || '')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        setValue(name, e.target.value)
        if (onChange) {
            onChange(e.target.value)
        }
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
            <CustomTextField
                fullWidth
                value={inputValue}
                onChange={handleChange}

                label={label}
                {...field}
                error={!!error}
                helperText={error?.message}
            />
            )}
        />
    )
}
export default TextField
