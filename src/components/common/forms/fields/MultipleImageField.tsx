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
  CardMedia,
  Grid,
  Chip,
  Alert,
  Paper,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import type { MultipleImageFieldProps } from '@/types/common/forms.types'

export const MultipleImageField = <T extends FieldValues>({
  name,
  label,
  accept = 'image/*',
  disabled = false,
  required = false,
  helperText,
  previewSize = 200,
  currentImageUrls = [],
  maxImages = 10,
}: MultipleImageFieldProps<T>) => {
  const { control } = useFormContext()
  const theme = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [isDragOver, setIsDragOver] = useState(false)

  // Helper to get preview URL from value (File or string)
  const getPreviewUrl = (value: File | string | null | undefined) => {
    if (!value) return null
    if (typeof value === 'string') return value
    if (value instanceof File) return URL.createObjectURL(value)

    return null
  }

  // Helper to check if the value is a URL from backend


  // Helper to get all images (current + new)
  const getAllImages = (fieldValue: any, currentUrls: string[]) => {
    const images: Array<{ file: File | string | null, isBackend: boolean, index: number }> = []

    // Add current backend images
    currentUrls.forEach((url, index) => {
      images.push({ file: url, isBackend: true, index })
    })

    // Add new uploaded files
    if (Array.isArray(fieldValue)) {
      fieldValue.forEach((file, index) => {
        if (file) {
          images.push({ file, isBackend: false, index: currentUrls.length + index })
        }
      })
    }

    return images
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent, field: any) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      const currentValue = field.value || []
      const updatedValue = [...currentValue, ...files]
      const limitedValue = updatedValue.slice(0, maxImages)

      field.onChange(limitedValue)
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const allImages = getAllImages(field.value, currentImageUrls)
        const hasReachedMax = allImages.length >= maxImages

        return (
          <Box width="100%">
            <Box component="label" htmlFor={`multiple-image-input-${name}`} sx={{ mb: 2, display: 'block' }}>
              <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
                {label} {required && <span style={{ color: theme.palette.error.main }}>*</span>}
              </Typography>
            </Box>

            {/* Max images warning */}
            {hasReachedMax && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Máximo {maxImages} imágenes permitidas
              </Alert>
            )}

            {/* Drag & Drop Area */}
            <Paper
              elevation={isDragOver ? 8 : 1}
              sx={{
                border: '1px dashed',  // ← Borde más fino
                borderColor: isDragOver
                  ? 'primary.main'
                  : theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.12)'  // ← Borde sutil en modo oscuro
                    : 'rgba(0, 0, 0, 0.08)',       // ← Borde sutil en modo claro
                borderRadius: 1,  // ← Radio más pequeño
                p: 4,
                mb: 3,
                textAlign: 'center',
                bgcolor: isDragOver
                  ? 'primary.50'
                  : theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50'
                }
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, field)}
              onClick={() => inputRef.current?.click()}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 48,
                  color: isDragOver ? 'primary.main' : theme.palette.text.secondary,
                  mb: 2
                }}
              />
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                Arrastra y suelta imágenes aquí
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                O haz clic para seleccionar archivos
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="large"
                sx={{ minWidth: 200 }}
                disabled={disabled || hasReachedMax}
              >
                Seleccionar Imágenes
              </Button>

              <input
                ref={inputRef}
                id={`multiple-image-input-${name}`}
                type="file"
                hidden
                accept={accept}
                multiple
                disabled={disabled || hasReachedMax}
                onChange={e => {
                  const files = e.target.files

                  if (!files) return

                  const newFiles = Array.from(files)

                  console.log('MultipleImageField onChange:', { name, newFiles })

                  // Initialize field value as array if it doesn't exist
                  const currentValue = field.value || []
                  const updatedValue = [...currentValue, ...newFiles]

                  // Limit to maxImages
                  const limitedValue = updatedValue.slice(0, maxImages)

                  field.onChange(limitedValue)
                }}
                onBlur={field.onBlur}
                data-testid={`multiple-image-input-${name}`}
              />
            </Paper>

            {/* Images Grid */}
            {allImages.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Imágenes ({allImages.length}/{maxImages})
                </Typography>
                <Grid container spacing={2}>
                  {allImages.map((imageData, index) => {
                    const previewUrl = getPreviewUrl(imageData.file)

                    if (!previewUrl) return null

                    return (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box position="relative">
                          <Card
                            sx={{
                              width: '100%',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              border: '1px solid',  // ← Borde sutil añadido
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.12)'  // ← Borde sutil en modo oscuro
                                : 'rgba(0, 0, 0, 0.08)',       // ← Borde sutil en modo claro
                              borderRadius: 1,  // ← Radio más pequeño
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: theme.shadows[4],
                                '& .image-preview': {
                                  filter: 'brightness(0.8)'
                                }
                              }
                            }}
                            onClick={() => {
                              setSelectedImageIndex(index)
                              setIsFullScreenOpen(true)
                            }}
                          >
                            <Box position="relative">
                              <CardMedia
                                component="img"
                                image={previewUrl}
                                alt={`${label} ${index + 1}`}
                                className="image-preview"
                                sx={{
                                  width: '100%',
                                  height: previewSize,
                                  objectFit: 'cover',
                                  borderRadius: 1,  // ← Radio más pequeño
                                  transition: 'filter 0.2s ease-in-out'
                                }}
                              />

                              {/* Backend image indicator */}
                              {imageData.isBackend && (
                                <Chip
                                  label="Actual"
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                                    color: 'white',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              )}

                              {/* Delete button */}
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()

                                  if (imageData.isBackend) {
                                    console.log('Backend image cannot be deleted directly')

                                    return
                                  }

                                  const currentValue = field.value as File[] | undefined

                                  if (Array.isArray(currentValue)) {
                                    const newFiles = currentValue.filter((_: File, i: number) => i !== (imageData.index - currentImageUrls.length))

                                    field.onChange(newFiles)
                                  }
                                }}
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: 'error.dark'
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Card>

                          {/* Image index */}
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              left: 8,
                              bgcolor: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: theme.shape.borderRadius,
                              fontSize: '0.7rem'
                            }}
                          >
                            {index + 1}
                          </Typography>
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </Box>
            )}

            {/* Helper Text */}
            {helperText && (
              <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                {helperText}
              </Typography>
            )}

            {/* Error Text */}
            {error && (
              <FormHelperText error sx={{ mt: 1 }}>
                {error.message}
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

                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    <IconButton
                      onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 16,
                        transform: 'translateY(-50%)',
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)'
                        },
                        zIndex: 1
                      }}
                    >
                      <i className="tabler-chevron-left" />
                    </IconButton>
                    <IconButton
                      onClick={() => setSelectedImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 16,
                        transform: 'translateY(-50%)',
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)'
                        },
                        zIndex: 1
                      }}
                    >
                      <i className="tabler-chevron-right" />
                    </IconButton>
                  </>
                )}

                {/* Image counter */}
                {allImages.length > 1 && (
                  <Typography
                    variant="h6"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      color: 'white',
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      px: 2,
                      py: 1,
                      borderRadius: theme.shape.borderRadius,
                      zIndex: 1
                    }}
                  >
                    {selectedImageIndex + 1} / {allImages.length}
                  </Typography>
                )}

                {/* Current image */}
                {allImages[selectedImageIndex] && (
                  <Box
                    component="img"
                    src={getPreviewUrl(allImages[selectedImageIndex].file) || ''}
                    alt={`${label} ${selectedImageIndex + 1}`}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '90vh',
                      objectFit: 'contain'
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </Box>
        )
      }}
    />
  )
}
