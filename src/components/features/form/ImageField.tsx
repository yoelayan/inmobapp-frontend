// React imports
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'

// Styles
import './css/ImageField.css'

// MUI imports
import { Box, Typography, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

// Third-party imports
import { useDropzone } from 'react-dropzone'
import { Controller } from 'react-hook-form'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'

// Local imports
import type FieldProps from '@/components/features/form/BaseField'

interface IFile {
  id?: number | string
  name: string
  url?: string
  image?: string
  order?: number
  preview?: string | Blob
}

interface ImageFieldProps extends FieldProps {
  data?: IFile[]
  multiple?: boolean
  onChange?: (value: any) => void
  refreshData?: (filters?: Record<string, any>) => Promise<void>
  deleteItem?: (id: string | number) => Promise<void>
  onReorder?: (images: any[]) => Promise<void>
}

const ImageField = ({
  value,
  label,
  name,
  control,
  error,
  setValue,
  data = [],
  multiple = false,
  onChange,
  refreshData,
  deleteItem,
  onReorder
}: ImageFieldProps) => {
  const [files, setFiles] = useState<IFile[]>([])
  const prevValueRef = useRef<any>(null)
  const prevDataRef = useRef<IFile[]>([])
  const dragAndDropRef = useRef<HTMLDivElement>(null)

  const processFile = useCallback((file: any, index: number): IFile => {
    if (typeof file === 'object' && file !== null) {
      return {
        id: file.id,
        name: file.name || `Imagen ${file.id || index + 1}`,
        url: file.url || (file.image ? `${file.image}` : ''),
        image: file.image || '',
        order: file.order || index,
        preview: file.preview || null
      }
    }

    if (typeof file === 'string') {
      return {
        name: `Imagen ${index + 1}`,
        url: file,
        image: file,
        order: index
      }
    }

    return file as IFile
  }, [])

  const processFiles = useCallback(
    (inputFiles: any): IFile[] => {
      if (!inputFiles) return []

      if (Array.isArray(inputFiles)) {
        return inputFiles.map((file, index) => processFile(file, index))
      }

      return [processFile(inputFiles, 0)]
    },
    [processFile]
  )

  useEffect(() => {
    if (value === prevValueRef.current && JSON.stringify(data) === JSON.stringify(prevDataRef.current)) {
      return
    }

    prevValueRef.current = value
    prevDataRef.current = data

    const sourceData = value || (data.length > 0 ? data : [])

    setFiles(processFiles(sourceData))
  }, [value, data, processFiles])

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview && typeof file.preview === 'string' && file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const getImageUrl = useCallback((file: IFile): string => {
    if (file.preview && typeof file.preview === 'string') {
      return file.preview
    }

    if (file.url) {
      return file.url
    }

    if (file.image) {
      return file.image
    }

    return ''
  }, [])

  const handleDelete = useCallback(
    (id?: number | string, index?: number) => {
      if (id !== undefined && deleteItem) {
        deleteItem(id)
          .then(async () => {
            if (refreshData) {
              await refreshData()
            }
          })
          .catch(error => console.error('Error deleting image:', error))
      } else if (index !== undefined) {
        const updatedFiles = [...files]

        updatedFiles.splice(index, 1)

        setFiles(updatedFiles)
        setValue(name, multiple ? updatedFiles : updatedFiles[0] || null)
      }
    },
    [files, deleteItem, refreshData, setValue, name, multiple]
  )

  const onDropAccepted = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file, idx) => ({
        id: `temp-${Date.now()}-${idx}`,
        name: file.name,
        preview: URL.createObjectURL(file)
      }))

      if (multiple) {
        const updatedFiles = [...files, ...newFiles]

        setFiles(updatedFiles)
        setValue(name, updatedFiles)
      } else {
        setFiles(newFiles)
        setValue(name, newFiles[0])
      }

      const fileList = acceptedFiles as unknown as FileList



      if (onChange) {
        await onChange(fileList)
      }

      if (refreshData) {
        refreshData()
      }
    },
    [files, multiple, name, onChange, refreshData, setValue]
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    noClick: true,
    noKeyboard: true,
    multiple,
    onDrop: onDropAccepted
  })

  const handleSortEnd = useCallback(
    (oldIndex: number, newIndex: number) => {
      const sortedFiles = arrayMoveImmutable(files, oldIndex, newIndex)

      const filesWithUpdatedOrder = sortedFiles.map((file, index) => ({
        ...file,
        order: index
      }))

      setFiles(filesWithUpdatedOrder)
      setValue(name, multiple ? filesWithUpdatedOrder : filesWithUpdatedOrder[0] || null)

      if (onReorder) {
        const imagesOrder = filesWithUpdatedOrder.map(file => ({
          id: file.id,
          order: file.order
        }))

        onReorder(imagesOrder)
      }
    },
    [files, multiple, name, onReorder, setValue]
  )

  const renderSimpleImageList = useMemo(
    () => (
      <div className={`images-list ${multiple ? 'multiple' : ''}`}>
        {files.map((file, index) => {
          const imageUrl = getImageUrl(file)

          return (
            <div key={`image-${file.id || index}`} className='images-list-item'>
              <Box position='relative' sx={{ width: '100%' }}>
                <div className={`image-box ${multiple ? 'multiple' : ''}`}>
                  <img
                    src={imageUrl}
                    alt={file.name}
                    onError={e => {
                      ;(e.target as HTMLImageElement).src = 'https://placehold.co/150?text=Imagen+no+encontrada'
                    }}
                  />
                </div>
                <IconButton className='icon-button' size='small' onClick={() => handleDelete(file.id, index)}>
                  <DeleteIcon fontSize='small' color='error' />
                </IconButton>
              </Box>
              <div className={`file-details ${multiple ? 'multiple' : ''}`}>
                <Typography variant='caption' className='file-name'>
                  {file.name}
                </Typography>
              </div>
            </div>
          )
        })}
      </div>
    ),
    [files, multiple, getImageUrl, handleDelete]
  )

  const renderImagesList = useCallback(() => {
    if (!files.length) {
      return (
        <Typography variant='body2' color='textSecondary' align='center'>
          No hay imágenes seleccionadas
        </Typography>
      )
    }

    if (!multiple || files.length <= 1) {
      return <Box sx={{ mt: 2 }}>{renderSimpleImageList}</Box>
    }

    return (
      <Box sx={{ mt: 2 }} ref={dragAndDropRef}>
        <SortableList
          onSortEnd={handleSortEnd}
          className={`images-list ${multiple ? 'multiple' : ''}`}
          draggedItemClassName='dragged'
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
          allowDrag={files.length > 1}
        >
          {files.map((file, index) => {
            const imageUrl = getImageUrl(file)
            const uniqueId = `image-${file.id || `idx-${index}-${file.name.replace(/\s+/g, '-')}`}`

            return (
              <SortableItem key={uniqueId}>
                <div className='images-list-item'>
                  <Box position='relative' sx={{ width: '100%' }}>
                    <div className={`image-box ${multiple ? 'multiple' : ''}`}>
                      <img
                        src={imageUrl}
                        alt={file.name}
                        style={{ userSelect: 'none', pointerEvents: 'none' }}
                        onError={e => {
                          ;(e.target as HTMLImageElement).src = 'https://placehold.co/150?text=Imagen+no+encontrada'
                        }}
                      />
                    </div>
                    <IconButton
                      className='icon-button delete-button'
                      size='small'
                      onClick={() => handleDelete(file.id, index)}
                    >
                      <DeleteIcon fontSize='small' color='error' />
                    </IconButton>
                    <div className='icon-button drag-button'>
                      <SortableKnob>
                        <IconButton
                          size='small'
                          style={{ cursor: 'grab' }}
                          aria-label='Arrastrar para reordenar'
                          title='Arrastrar para reordenar'
                        >
                          <DragIndicatorIcon fontSize='small' color='inherit' />
                        </IconButton>
                      </SortableKnob>
                    </div>
                  </Box>
                  <div className={`file-details ${multiple ? 'multiple' : ''}`}>
                    <Typography variant='caption' className='file-name'>
                      {file.name}
                    </Typography>
                  </div>
                </div>
              </SortableItem>
            )
          })}
        </SortableList>
      </Box>
    )
  }, [files, multiple, getImageUrl, renderSimpleImageList, handleDelete, handleSortEnd])

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography variant='subtitle1' gutterBottom>
            {label}
          </Typography>
          <Box
            {...getRootProps()}
            sx={{
              p: 2,
              border: '2px dashed',
              borderColor: error ? 'error.main' : 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper',
              mb: 2,
              textAlign: 'center'
            }}
          >
            <input {...getInputProps()} />
            <Typography variant='body1' gutterBottom>
              Arrastra y suelta imágenes aquí
            </Typography>
            <Button onClick={open} variant='contained' color='primary'>
              Seleccionar Imágenes
            </Button>
          </Box>

          {renderImagesList()}

          {error && (
            <Typography variant='caption' color='error'>
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  )
}

export default ImageField
