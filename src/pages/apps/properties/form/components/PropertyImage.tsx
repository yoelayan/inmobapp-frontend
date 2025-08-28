import React, { useRef, useState, useEffect } from 'react'

import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'

import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Card,
  CardMedia,
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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

import { propertyImageSchema, type PropertyImageFormData } from '@/validations/propertyImageSchema'
import useProperties from '@/hooks/api/realstate/useProperties'
import { useNotification } from '@/hooks/useNotification'

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
  const inputRef = useRef<HTMLInputElement>(null)
  const { notify } = useNotification()

  {/* TODO: usar zustband para los estados */}
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [validationError, setValidationError] = useState<string>('')
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [backendImages, setBackendImages] = useState<Array<{id: number, image: string, order?: number}>>([])
  const [isReordering, setIsReordering] = useState(false)


  // Usar el hook useProperties para manejar la lógica de imágenes
  const { getAllImages, uploadImages, deleteImage, updateImagesOrder } = useProperties()

  // Detectar si estamos en modo edición
  const isEditMode = !!propertyId

  // Cargar imágenes existentes del backend si estamos en modo edición
  useEffect(() => {
    if (isEditMode && propertyId) {
      fetchExistingImages()
    } else {
      // En modo creación, limpiar imágenes del backend y errores
      setBackendImages([])
      setValidationError('')
    }
  }, [isEditMode, propertyId])

  // Obtener imágenes existentes del backend usando useProperties
  const fetchExistingImages = async () => {
    if (!propertyId) return

    // Limpiar errores previos antes de hacer la petición
    setValidationError('')

    try {
      const response = await getAllImages(propertyId)

      console.log('Images data:', response)

      // El backend devuelve { results: [...], total: number, page: number, ... }
      // pero el tipo IRealProperty no incluye esta estructura
      const images = (response as any).results || []

      // Asegurar que las imágenes estén ordenadas correctamente
      const sortedImages = images.sort((a: any, b: any) => {
        const orderA = a.order || 0
        const orderB = b.order || 0
        return orderA - orderB
      })

      setBackendImages(sortedImages)

      // Limpiar errores si todo salió bien
      setValidationError('')
    } catch (error: unknown) {
      // No mostrar errores molestos en la consola para el usuario
      // Solo loggear para debugging del desarrollador
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching images:', error)
      }

      // Mostrar mensaje amigable al usuario
      setValidationError('No se pudieron cargar las imágenes existentes')

      // Limpiar las imágenes del backend para evitar errores de UI
      setBackendImages([])
    }
  }

  // Subir imágenes al backend usando useProperties
  const handleUploadImages = async (files: File[]) => {
    if (!propertyId) {
      // En modo creación, solo llamar al callback
      onImagesChange?.(files)

      return
    }

    try {
      setIsUploading(true)

      // Convertir File[] a FileList para usar con uploadImages
      const dataTransfer = new DataTransfer()

      files.forEach(file => dataTransfer.items.add(file))
      const fileList = dataTransfer.files

      // Usar el método de useProperties
      await uploadImages(propertyId, fileList)

        // Recargar las imágenes existentes
      await fetchExistingImages()

        // Limpiar archivos de carga
        setUploadingFiles([])
    } catch (error: unknown) {
      console.error('Error uploading images:', error)

      if (error instanceof Error) {
        setValidationError(`Error al subir las imágenes: ${error.message}`)
      } else {
          setValidationError('Error al subir las imágenes')
      }
    } finally {
      setIsUploading(false)
    }
  }

  // Eliminar imagen del backend usando useProperties
  const handleDeleteBackendImage = async (imageId: number) => {
    if (!propertyId) return

    try {
      // Usar el método de useProperties
      await deleteImage(imageId)

        // Recargar las imágenes existentes
        await fetchExistingImages()
    } catch (error: unknown) {
      console.error('Error deleting image:', error)

      if (error instanceof Error) {
        setValidationError(`Error al eliminar la imagen: ${error.message}`)
      } else {
        setValidationError('Error al eliminar la imagen')
      }
    }
  }

  // Manejar el reordenamiento de imágenes
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !propertyId) return

    const { source, destination } = result

    // Si la imagen se movió a la misma posición, no hacer nada
    if (source.index === destination.index) return

    // No permitir mover la primera imagen (portada) a otra posición
    if (source.index === 0) {
      notify('La imagen de portada no puede ser movida', 'warning')
      return
    }

    try {
      setIsReordering(true)

      // Crear una copia del array de imágenes
      const newImagesOrder = Array.from(backendImages)

      // Mover la imagen a la nueva posición
      const [movedImage] = newImagesOrder.splice(source.index, 1)

      newImagesOrder.splice(destination.index, 0, movedImage)

      // Actualizar el estado local inmediatamente para una mejor UX
      setBackendImages(newImagesOrder)

      // Preparar los datos para enviar al backend
      const imagesWithOrder = newImagesOrder.map((img, index) => ({
        id: img.id,
        order: index + 1
      }))

      // Enviar el nuevo orden al backend
      await updateImagesOrder(propertyId, imagesWithOrder)

      // Mostrar mensaje de éxito
      setValidationError('')
    } catch (error: unknown) {
      console.error('Error reordering images:', error)

      // Revertir el cambio en caso de error
      await fetchExistingImages()

      if (error instanceof Error) {
        setValidationError(`Error al reordenar las imágenes: ${error.message}`)
      } else {
        setValidationError('Error al reordenar las imágenes')
      }
    } finally {
      setIsReordering(false)
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
  const getAllImagesForDisplay = () => {
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
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error && Array.isArray((error as any).errors) && (error as any).errors.length > 0) {
        setValidationError((error as any).errors[0].message)
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

        // Subir las imágenes usando useProperties
        await handleUploadImages(files)
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

      // Subir las imágenes usando useProperties
      await handleUploadImages(newFiles)
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
      // Eliminar imagen del backend usando useProperties
      await handleDeleteBackendImage(imageData.imageId)
    } else if (imageData.isUploading) {
      // Eliminar archivo que se está cargando
      const newFiles = uploadingFiles.filter((_: File, i: number) =>
        i !== (imageData.index - backendImages.length)
      )

      setUploadingFiles(newFiles)
    }
  }

  const allImages = getAllImagesForDisplay()

  // Solo mostrar drag & drop para reordenar si hay imágenes del backend
  const showReorderDragDrop = isEditMode && backendImages.length > 1

        return (
          <Box width="100%">
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              {label} {required && <span className="text-red-500">*</span>}
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

      {/* Reordering indicator */}
      {isReordering && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            Reordenando imágenes...
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
            {/* Todo: usar styled para el paper */}
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

            {/* Images Grid with Drag & Drop Reordering */}
            {allImages.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Imágenes ({allImages.length})
                  {showReorderDragDrop && (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        ml: 2,
                        color: 'text.secondary',
                        fontStyle: 'italic'
                      }}
                    >
                      • Arrastra las imágenes para reordenarlas
                    </Typography>
                  )}
                </Typography>

                {/* Contenedor principal que ocupa las 12 columnas */}
                <Box
                  sx={{
                    width: '100%', // Ocupa todo el ancho disponible del padre
                    maxWidth: '100%', // No exceder el ancho del padre
                    overflow: 'hidden', // Oculta el overflow del contenedor principal
                  }}
                >
                  {/* Drag & Drop Context para reordenar imágenes */}
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
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

                            // Solo las imágenes del backend pueden ser arrastradas para reordenar
                            const canDrag = imageData.isBackend && showReorderDragDrop

                            return (
                              <Draggable
                                key={imageData.imageId || `uploading-${index}`}
                                draggableId={String(imageData.imageId || `uploading-${index}`)}
                                index={index}
                                isDragDisabled={!canDrag}
                              >
                                {(provided, snapshot) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
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
                                          cursor: canDrag ? 'grab' : 'pointer',
                                          overflow: 'hidden',
                                          border: '1px solid',
                                          borderColor: snapshot.isDragging
                                            ? 'primary.main'
                                            : theme.palette.mode === 'dark'
                                              ? 'rgba(255, 255, 255, 0.12)'
                                              : 'rgba(0, 0, 0, 0.08)',
                                          borderRadius: 1,
                                          transition: 'all 0.2s ease-in-out',
                                          transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
                                          boxShadow: snapshot.isDragging ? theme.shadows[8] : 'none',
                                          '&:hover': {
                                            transform: snapshot.isDragging ? 'rotate(5deg)' : 'scale(1.02)',
                                            boxShadow: snapshot.isDragging ? theme.shadows[8] : theme.shadows[4],
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

                                          {/* Drag handle para reordenar */}
                                          {canDrag && (
                                            <Box
                                              {...provided.dragHandleProps}
                                              sx={{
                                                position: 'absolute',
                                                top: 8,
                                                left: 8,
                                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: 24,
                                                height: 24,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'grab',
                                                '&:active': {
                                                  cursor: 'grabbing'
                                                },
                                                zIndex: 2
                                              }}
                                            >
                                              <DragIndicatorIcon sx={{ fontSize: 16 }} />
                                            </Box>
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

                                      {/* Portada label for first image */}
                                      {index === 0 && (
                                        <Chip
                                          label="Portada"
                                          size="small"
                                          sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            bgcolor: 'success.main',
                                            color: 'white',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold'
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Box>
              </Box>
            )}

            {/* Helper Text */}
            {helperText && (
              <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                {helperText}
              </Typography>
            )}

            {/* Portada info */}
            <Typography variant="body2" sx={{ mt: 1, color: 'success.main', fontStyle: 'italic' }}>
              💡 La primera imagen será la imagen de portada de la propiedad
            </Typography>

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
