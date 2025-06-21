import React, { useEffect, useState, useCallback } from 'react'

import type { TextFieldProps } from '@mui/material/TextField'

import CustomTextField from '@core/components/mui/TextField'

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  // Sincronizar el valor interno cuando cambia el valor externo
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Usar useCallback para la función de debounce
  const debouncedOnChange = useCallback(() => {
    const handler = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => {
      clearTimeout(handler)
    }
  }, [value, onChange, debounce])

  // Efecto para ejecutar el callback debounced
  useEffect(() => {
    // Solo ejecutar el debounce si el valor interno es diferente del valor inicial
    if (value !== initialValue) {
      return debouncedOnChange()
    }
  }, [value, initialValue, debouncedOnChange])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

export default DebouncedInput
