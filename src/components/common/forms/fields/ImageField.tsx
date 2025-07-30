import React, { useRef } from 'react'

import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

import { Box, Button, FormHelperText, Typography, Avatar } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'

import type { ImageFieldProps } from '@/types/common/forms.types'


export const ImageField = <T extends FieldValues>({
  name,
  label,
  accept = 'image/*',
  disabled = false,
  required = false,
  helperText,
  previewSize = 96,
  ...props
}: ImageFieldProps<T>) => {
  const { control } = useFormContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Helper to get preview URL from value (File or string)
  const getPreviewUrl = (value: File | string | null | undefined) => {
    if (!value) return null
    if (typeof value === 'string') return value
    if (value instanceof File) return URL.createObjectURL(value)

    return null
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const previewUrl = getPreviewUrl(field.value)

        return (
          <Box>
            <Typography variant="subtitle1" mb={0.5}>
              {label} {required && <span className="text-red-600">*</span>}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                src={previewUrl || undefined}
                alt={label}
                sx={{
                  width: previewSize,
                  height: previewSize,
                  bgcolor: '#f0f0f0',
                  border: '1px solid #e0e0e0',
                  fontSize: previewSize / 2,
                }}
                variant="rounded"
              >
                {!previewUrl && <ImageIcon fontSize="inherit" />}
              </Avatar>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
              >
                Seleccionar imagen
                <input
                  {...props}
                  ref={inputRef}
                  type="file"
                  hidden
                  accept={accept}
                  disabled={disabled}
                  onChange={e => {
                    const files = e.target.files

                    field.onChange(files && files.length > 0 ? files[0] : null)
                  }}
                  onBlur={field.onBlur}
                  data-testid={`image-input-${name}`}
                />
              </Button>
            </Box>
            {previewUrl && typeof field.value === 'object' && field.value?.name && (
              <Typography variant="body2">{field.value.name}</Typography>
            )}
            {(error || helperText) && (
              <FormHelperText error={!!error}>
                {error?.message || helperText}
              </FormHelperText>
            )}
          </Box>
        )
      }}
    />
  )
}
