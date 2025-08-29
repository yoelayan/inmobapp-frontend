import React, { useRef, useState } from 'react'

import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

import {
  Box,
  Button,
  FormHelperText,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Card,
  CardMedia
} from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'

import type { ImageFieldProps } from '@/types/common/forms.types'


export const ImageField = <T extends FieldValues>({
  name,
  label,
  accept = 'image/*',
  disabled = false,
  required = false,
  helperText,
  previewSize = 200,
  currentImageUrl,
}: ImageFieldProps<T>) => {
  const { control } = useFormContext()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)

  // Helper to get preview URL from value (File or string)
  const getPreviewUrl = (value: File | string | null | undefined) => {
    if (!value) return null
    if (typeof value === 'string') return value
    if (value instanceof File) return URL.createObjectURL(value)

    return null
  }

  // Helper to check if the value is a URL from backend
  const isBackendUrl = (value: File | string | null | undefined) => {
    return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const previewUrl = getPreviewUrl(field.value) || (currentImageUrl && !field.value ? currentImageUrl : null)
        const isUrlFromBackend = isBackendUrl(field.value) || (currentImageUrl && !field.value)

        return (
          <Box width="100%">
            <Box component="label" htmlFor={`image-input-${name}`} sx={{ mb: 1, display: 'block' }}>
              <Typography variant="subtitle1" component="span">
                {label} {required && <span className="text-red-600">*</span>}
              </Typography>
            </Box>

            {/* Image Preview */}
            {previewUrl && (
              <Box mb={2} position="relative" width="100%">
                {isUrlFromBackend && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      zIndex: 1
                    }}
                  >
                    Imagen actual
                  </Typography>
                )}
                <Card
                  sx={{
                    width: '100%',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      '& .zoom-overlay': {
                        opacity: 1
                      },
                      '& .image-preview': {
                        filter: 'brightness(0.7)'
                      }
                    }
                  }}
                  onClick={() => setIsFullScreenOpen(true)}
                >
                  <Box position="relative">
                    <CardMedia
                      component="img"
                      image={previewUrl}
                      alt={label}
                      className="image-preview"
                      sx={{
                        width: '100%',
                        height: previewSize,
                        objectFit: 'cover',
                        borderRadius: 1,
                        transition: 'filter 0.2s ease-in-out'
                      }}
                    />
                    {/* Delete button */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()

                        if (!isUrlFromBackend) {
                          field.onChange(null)
                        }

                        if (inputRef.current) {
                          inputRef.current.value = ''
                        }
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.9)'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Box>
            )}

            {/* File Input Button */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              disabled={disabled}
              fullWidth
              sx={{
                height: 48,
                borderStyle: 'dashed',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2
                }
              }}
            >
              {previewUrl ? (isUrlFromBackend ? 'Cambiar imagen actual' : 'Cambiar imagen') : 'Seleccionar imagen'}
              <input
                ref={inputRef}
                id={`image-input-${name}`}
                type="file"
                hidden
                accept={accept}
                disabled={disabled}
                onChange={e => {
                  const files = e.target.files
                  const selectedFile = files && files.length > 0 ? files[0] : null

                  console.log('ImageField onChange:', { name, selectedFile })
                  field.onChange(selectedFile)
                }}
                onBlur={field.onBlur}
                data-testid={`image-input-${name}`}
              />
            </Button>

            {/* File Name Display */}
            {previewUrl && typeof field.value === 'object' && field.value?.name && (
              <Typography variant="body2" mt={1} color="text.secondary">
                {field.value.name}
              </Typography>
            )}

            {/* Error/Helper Text */}
            {(error || helperText) && (
              <FormHelperText error={!!error} sx={{ mt: 1 }}>
                {error?.message || helperText}
              </FormHelperText>
            )}

            {/* Full Screen Dialog */}
            <Dialog
              open={isFullScreenOpen}
              onClose={() => setIsFullScreenOpen(false)}
              maxWidth="xl"
              fullWidth
              PaperProps={{
                sx: {
                  bgcolor: 'rgba(0, 0, 0, 0.9)',
                  boxShadow: 'none'
                }
              }}
            >
              <DialogContent sx={{ p: 0, position: 'relative' }}>
                <IconButton
                  onClick={() => setIsFullScreenOpen(false)}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)'
                    },
                    zIndex: 1
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Box
                  component="img"
                  src={previewUrl || ''}
                  alt={label}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '90vh',
                    objectFit: 'contain'
                  }}
                />
              </DialogContent>
            </Dialog>
          </Box>
        )
      }}
    />
  )
}
