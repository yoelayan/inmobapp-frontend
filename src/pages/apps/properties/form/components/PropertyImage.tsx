import React, { useRef, useState, useEffect, useCallback } from 'react'

import {
  Box,
  Button,
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
  useTheme,
  CircularProgress
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useAuthContext } from '@/auth/context/AuthContext'

import { propertyImageSchema, type PropertyImageFormData } from '@/validations/propertyImageSchema'

interface PropertyImageProps {
  label?: string
  accept?: string
  disabled?: boolean
  required?: boolean
  helperText?: string
  previewSize?: number
  currentImageUrls?: string[]
  onImagesChange?: (images: File[]) => void
  isLoading?: boolean
  propertyId?: number // Para detectar si estamos en modo edición
}

export const PropertyImage = ({
  label = 'Imágenes',
  accept = 'image/*',
  disabled = false,
  required = false,
  helperText,
  previewSize = 170,
  currentImageUrls = [],
  onImagesChange,
  isLoading = false,
  propertyId
}: PropertyImageProps) => {
  const theme = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [validationError, setValidationError] = useState<string>('')
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [backendImages, setBackendImages] = useState<Array<{id: number, image: string, order?: number}>>([])
  const { session } = useAuthContext()

  // Detectar si estamos en modo edición
  const isEditMode = !!propertyId

  // Cargar imágenes existentes del backend si estamos en modo edición
  useEffect(() => {
    if (isEditMode && propertyId) {
      fetchExistingImages()
    }
  }, [isEditMode, propertyId])

  // Obtener imágenes existentes del backend
  const fetchExistingImages = async () => {
    if (!propertyId) return

    // Usar la URL completa del backend (sin duplicar /api/)
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/properties/${propertyId}/get-images/`
    console.log('Fetching images from:', url)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

      const headers: Record<string, string> = {}
      if (session?.access) {
        headers['Authorization'] = `Bearer ${session.access}`
      }

      const response = await fetch(url, {
        signal: controller.signal,
        headers
      })

      clearTimeout(timeoutId)
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (response.ok) {
        const contentType = response.headers.get('content-type')
        console.log('Content-Type:', contentType)

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          console.log('Images data:', data)
          setBackendImages(data.results || [])
        } else {
          console.error('Invalid content type:', contentType)
          // Vamos a ver qué está devolviendo realmente el backend
          const responseText = await response.text()
          console.error('Response body (first 500 chars):', responseText.substring(0, 500))
          setValidationError('Error: Respuesta del servidor no es JSON')
        }
      } else {
        console.error('Error response:', response.status, response.statusText)
        // También ver qué devuelve en caso de error
        const responseText = await response.text()
        console.error('Error response body (first 500 chars):', responseText.substring(0, 500))
        setValidationError(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout')
        setValidationError('Error: Timeout al cargar las imágenes')
      } else {
        console.error('Error fetching images:', error)
        setValidationError('Error al cargar las imágenes')
      }
    }
  }

  // Subir imágenes al backend
  const uploadImages = async (files: File[]) => {
    if (!propertyId) {
      // En modo creación, solo llamar al callback
      onImagesChange?.(files)
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      files.forEach(file => {
        formData.append('images', file)
      })

      // Usar la URL completa del backend (sin duplicar /api/)
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/properties/${propertyId}/upload-images/`
      console.log('Uploading images to:', url)
      console.log('Files to upload:', files.map(f => ({ name: f.name, size: f.size, type: f.type })))

      const headers: Record<string, string> = {}
      if (session?.access) {
        headers['Authorization'] = `Bearer ${session.access}`
      }

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers
      })

      console.log('Upload response status:', response.status)
      console.log('Upload response headers:', response.headers)

      if (response.ok) {
        const contentType = response.headers.get('content-type')
        console.log('Upload response content-type:', contentType)

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          console.log('Upload success data:', data)
        } else {
          const responseText = await response.text()
          console.error('Upload response not JSON (first 500 chars):', responseText.substring(0, 500))
        }

        // Recargar las imágenes existentes
        await fetchExistingImages()
        // Limpiar archivos de carga
        setUploadingFiles([])
      } else {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          setValidationError(errorData.message || 'Error al subir las imágenes')
        } else {
          const responseText = await response.text()
          console.error('Upload error response (first 500 chars):', responseText.substring(0, 500))
          setValidationError('Error al subir las imágenes')
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      setValidationError('Error al subir las imágenes')
    } finally {
      setIsUploading(false)
    }
  }

  // Eliminar imagen del backend
  const deleteBackendImage = async (imageId: number) => {
    if (!propertyId) return

    try {
      // Usar la misma URL absoluta que las otras funciones
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/properties/${propertyId}/delete-image/`
      console.log('Deleting image from:', url, 'Image ID:', imageId)

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      if (session?.access) {
        headers['Authorization'] = `Bearer ${session.access}`
      }

      // Enviar image_id en el body como espera el backend
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ image_id: imageId })
      })

      if (response.ok) {
        // Recargar las imágenes existentes
        await fetchExistingImages()
      } else {
        const errorData = await response.json()
        setValidationError(errorData.message || 'Error al eliminar la imagen')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      setValidationError('Error al eliminar la imagen')
    }
  }

  // Helper to get preview URL from value (File or string)
  const getPreviewUrl = (value: File | string | null | undefined) => {
    if (!value) return null
    if (typeof value === 'string') return value
    if (value instanceof File) return URL.createObjectURL(value)
    return null
  }

  // Helper to get all images (backend + uploading + current)
  const getAllImages = () => {
    const allImages: Array<{
      file: File | string | null,
      isBackend: boolean,
      index: number,
      imageId?: number,
      isUploading?: boolean
    }> = []

    // Add backend images
    backendImages.forEach((img, index) => {
      allImages.push({
        file: img.image,
        isBackend: true,
        index,
        imageId: img.id
      })
    })

    // Add uploading files
    uploadingFiles.forEach((file, index) => {
      allImages.push({
        file,
        isBackend: false,
        index: backendImages.length + index,
        isUploading: true
      })
    })

    // Add current image URLs (para compatibilidad)
    currentImageUrls.forEach((url, index) => {
      if (!backendImages.find(img => img.image === url)) {
        allImages.push({
          file: url,
          isBackend: true,
          index: backendImages.length + uploadingFiles.length + index
        })
      }
    })

    return allImages
  }

  // Validate images using the schema
  const validateImages = (newImages: File[]) => {
    try {
      const data: PropertyImageFormData = {
        images: newImages,
        currentImageUrls
      }
      propertyImageSchema.parse(data)
      setValidationError('')
      return true
    } catch (error: any) {
      if (error.errors && error.errors.length > 0) {
        setValidationError(error.errors[0].message)
      }
      return false
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      // Validar archivos
      if (validateImages(files)) {
        // Agregar archivos a la lista de carga
        setUploadingFiles(prev => [...prev, ...files])

        // Subir las imágenes
        await uploadImages(files)
      }
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    console.log('PropertyImage onChange:', { newFiles })

    // Validar archivos
    if (validateImages(newFiles)) {
      // Agregar archivos a la lista de carga
      setUploadingFiles(prev => [...prev, ...newFiles])

      // Subir las imágenes
      await uploadImages(newFiles)
    }

    // Limpiar el input
    e.target.value = ''
  }

  const handleDeleteImage = async (imageData: {
    file: File | string | null,
    isBackend: boolean,
    index: number,
    imageId?: number,
    isUploading?: boolean
  }) => {
    if (imageData.isBackend && imageData.imageId) {
      // Eliminar imagen del backend
      await deleteBackendImage(imageData.imageId)
    } else if (imageData.isUploading) {
      // Eliminar archivo que se está cargando
      const newFiles = uploadingFiles.filter((_: File, i: number) =>
        i !== (imageData.index - backendImages.length)
      )
      setUploadingFiles(newFiles)
    }
  }

  const allImages = getAllImages()

        return (
          <Box width="100%">
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              {label} {required && <span style={{ color: theme.palette.error.main }}>*</span>}
            </Typography>

      {/* Loading indicator */}
      {isLoading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            Cargando imágenes...
          </Box>
        </Alert>
      )}

      {/* Uploading indicator */}
      {isUploading && (
              <Alert severity="info" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            Subiendo imágenes...
          </Box>
        </Alert>
      )}

      {/* Validation error */}
      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
              </Alert>
            )}

            {/* Drag & Drop Area */}
            <Paper
              elevation={isDragOver ? 8 : 1}
              sx={{
          border: '1px dashed',
                borderColor: isDragOver
                  ? 'primary.main'
                  : theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(0, 0, 0, 0.08)',
          borderRadius: 1,
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
        onDrop={handleDrop}
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
          disabled={disabled || isLoading || isUploading}
              >
                Seleccionar Imágenes
              </Button>

              <input
                ref={inputRef}
                type="file"
                hidden
                accept={accept}
                multiple
          disabled={disabled || isLoading || isUploading}
          onChange={handleFileSelect}
              />
            </Paper>

            {/* Images Grid with Horizontal Scroll - Show 4 at once */}
            {allImages.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Imágenes ({allImages.length})
                </Typography>

                {/* Contenedor principal que ocupa las 12 columnas */}
                <Box
                  sx={{
                    width: '100%', // Ocupa todo el ancho disponible del padre
                    maxWidth: '100%', // No exceder el ancho del padre
                    overflow: 'hidden', // Oculta el overflow del contenedor principal
                  }}
                >
                  {/* Contenedor de scroll horizontal que ocupa las 12 columnas */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      overflowX: 'auto', // Scroll horizontal automático
                      overflowY: 'hidden', // Sin scroll vertical
                      pb: 2, // Padding bottom para el scrollbar
                      minHeight: previewSize + 60, // Altura mínima para evitar saltos
                      width: '100%', // Ocupa todo el ancho disponible (12 columnas)
                      '&::-webkit-scrollbar': {
                        height: 8,
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 4,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 4,
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'rgba(0, 0, 0, 0.5)',
                        },
                      },
                    }}
                  >
                    {allImages.map((imageData, index) => {
                      const previewUrl = getPreviewUrl(imageData.file)
                      if (!previewUrl) return null

                      return (
                        <Box
                          key={index}
                          sx={{
                            flexShrink: 0, // CRÍTICO: Evita que las imágenes se compriman
                            width: previewSize, // Ancho fijo igual al previewSize
                            height: previewSize + 40, // Altura fija para el contenedor
                          }}
                        >
                          <Box position="relative">
                            <Card
                              sx={{
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: theme.palette.mode === 'dark'
                                  ? 'rgba(255, 255, 255, 0.12)'
                                  : 'rgba(0, 0, 0, 0.08)',
                                borderRadius: 1,
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
                                    borderRadius: 1,
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

                                {/* Uploading indicator */}
                                {imageData.isUploading && (
                                  <Chip
                                    label="Subiendo..."
                                    size="small"
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      left: 8,
                                      bgcolor: 'primary.main',
                                      color: 'white',
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                )}

                                {/* Delete button */}
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteImage(imageData)
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
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Helper Text */}
            {helperText && (
              <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                {helperText}
              </Typography>
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
}
