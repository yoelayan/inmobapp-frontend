import React from 'react'

import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

import { Box, Button, FormHelperText, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'

import type { FormFieldBaseProps } from '@/types/common/forms.types'

interface FileFieldProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  accept?: string
  multiple?: boolean
  helperText?: string
}

export const FileField = <T extends FieldValues>({
  name,
  label,
  accept,
  multiple = false,
  disabled = false,
  required = false,
  helperText,
  ...props
}: FileFieldProps<T>) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Typography variant="subtitle1" mb={0.5}>
            {label} {required && <span className="text-red-600">*</span>}
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            disabled={disabled}
            sx={{ mb: 1 }}
          >
            {multiple ? 'Seleccionar archivos' : 'Seleccionar archivo'}
            <input
              {...props}
              type="file"
              hidden
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              onChange={e => {
                const files = e.target.files

                if (multiple) {
                  field.onChange(files ? Array.from(files) : [])
                } else {
                  field.onChange(files && files.length > 0 ? files[0] : null)
                }
              }}
              onBlur={field.onBlur}
              data-testid={`file-input-${name}`}
            />
          </Button>
          <Box>
            {multiple && Array.isArray(field.value) && field.value.length > 0 && (
              <Box>
                {field.value.map((file: File, idx: number) => (
                  <Typography key={idx} variant="body2">
                    {file.name}
                  </Typography>
                ))}
              </Box>
            )}
            {!multiple && field.value && field.value.name && (
              <Typography variant="body2">{field.value.name}</Typography>
            )}
          </Box>
          {(error || helperText) && (
            <FormHelperText error={!!error}>
              {error?.message || helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  )
}
