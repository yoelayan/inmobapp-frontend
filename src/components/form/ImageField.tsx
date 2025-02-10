import React, { useState, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import {
  Button,
  Typography,
  FormHelperText,
  IconButton,
  Box,
  Card,
  CardContent,
  List,
  ListItem
} from '@mui/material'
import './css/ImageField.css'

type FieldProps = {
  label: string
  name: string
  value?: Array<File | string>
  error?: any
  control: any
  setValue: any
}

type FileItem = {
  id: string
  type: 'file'
  file: File
}

type UrlItem = {
  id: string
  type: 'url'
  url: string
}

type ImageItem = FileItem | UrlItem

interface ImageFieldProps extends FieldProps {
  multiple?: boolean
}

// Utilidad para generar un id cualquiera
const generateId = () => crypto.randomUUID?.() || String(Math.random())

const ImageBox = ({
  name,
  multiple,
  field,
  setValue,
  initialValue
}: {
  name: string
  multiple: boolean
  field: any
  setValue: any
  initialValue?: Array<File | string>
}) => {
  const [imageList, setImageList] = useState<ImageItem[]>([])

  // Cada vez que cambie el value externo, se vuelven a generar los ítems del array:
  useEffect(() => {
    if (Array.isArray(initialValue)) {
      const transformed = initialValue.map(item => {
        if (typeof item === 'string') {
          return {
            id: generateId(),
            type: 'url',
            url: item
          } as UrlItem
        } else {
          return {
            id: generateId(),
            type: 'file',
            file: item
          } as FileItem
        }
      })
      setImageList(transformed)
    }
  }, [initialValue])

  // Sincroniza los valores hacia el form cada vez que imageList cambie:
  useEffect(() => {
    // Convertir todo a array de File (para que cumpla el schema original),
    // asumiendo que los strings son solo de lectura y no se reenviarán
    // (o bien puedes enviarlos tal cual, si tu backend lo maneja).
    const onlyFiles = imageList
      .filter(item => item.type === 'file')
      .map(item => (item as FileItem).file)

    setValue(name, onlyFiles)
  }, [imageList, name, setValue])

  // Manejo de Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      // En caso de múltiples imágenes, se concatena, sino se reemplaza
      setImageList(prev => {
        const newItems = acceptedFiles.map(file => ({
          id: generateId(),
          type: 'file',
          file
        } as FileItem))
        return multiple ? [...prev, ...newItems] : newItems
      })
    },
    multiple
  })

  const handleRemoveFile = (id: string) => {
    setImageList(prev => prev.filter(item => item.id !== id))
  }

  const handleRemoveAll = () => {
    setImageList([])
  }

  // Vista previa adaptada
  const renderFilePreview = (item: ImageItem) => {
    if (item.type === 'file') {
      const file = item.file
      if (file.type.startsWith('image')) {
        return (
          <Box className={`image-box ${multiple ? 'multiple' : ''}`}>
            <img alt={file.name} src={URL.createObjectURL(file)} />
          </Box>
        )
      } else {
        return <i className='tabler-file-description' />
      }
    } else {
      // item.type === 'url'
      return (
        <Box className={`image-box ${multiple ? 'multiple' : ''}`}>
          <img alt='img' src={item.url} />
        </Box>
      )
    }
  }

  // Render de cada ítem en la lista
  const imageItems = imageList.map(item => {
    const size =
      item.type === 'file'
        ? (item.file.size / 1024).toFixed(2) + ' KB'
        : '—' // o cualquier meta para URL
    const name =
      item.type === 'file'
        ? item.file.name
        : item.url.split('/').pop() || 'imagen'

    return (
      <ListItem key={item.id} className='images-list-item pis-4 plb-3'>
        <div className={`file-details ${multiple ? 'multiple' : ''}`}>
          <div className='file-preview'>{renderFilePreview(item)}</div>
          <div>
            <Typography className='file-name font-medium' color='text.primary'>
              {name}
            </Typography>
            <Typography className='file-size' variant='body2'>
              {size}
            </Typography>
          </div>
        </div>
        <IconButton onClick={() => handleRemoveFile(item.id)} className='icon-button'>
          <i className='tabler-x text-xl' />
        </IconButton>
      </ListItem>
    )
  })

  const handleBrowse = () => {
    (document.querySelector(`input[name=${name}]`) as HTMLInputElement)?.click()
  }

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} name={name} ref={field.ref} />
      {(multiple || imageList.length === 0) && (
        <div className='flex items-center flex-col gap-2 text-center'>
          <Typography variant='h4'>
            {imageList.length > 0 ? 'Imágenes Seleccionadas' : 'Arrastra y suelta una imagen aquí'}
          </Typography>
          <Typography color='text.disabled'>o</Typography>
          <Button variant='tonal' size='small' onClick={handleBrowse}>
            Buscar Imagen
          </Button>
        </div>
      )}

      {imageList.length > 0 && (
        <div className='mt-4'>
          <Box display='flex' gap={2}>
            <List className={`images-list ${multiple ? 'multiple' : ''}`}>{imageItems}</List>
          </Box>
          <Box display='flex' justifyContent='start' gap={2}>
            <Button color='error' variant='tonal' onClick={handleRemoveAll}>
              {multiple ? 'Eliminar Todos' : 'Eliminar'}
            </Button>
          </Box>
        </div>
      )}
    </div>
  )
}

const ImageField = ({ label, name, multiple = false, value = [], error, control, setValue }: ImageFieldProps) => {
  return (
    <Card className='mt-4'>
      <CardContent>
        {Array.isArray(error)
          ? error.map((err: any) => (
              <FormHelperText key={err} error>
                {err.message}
              </FormHelperText>
            ))
          : error && <FormHelperText error>{error.message}</FormHelperText>
        }

        <Typography variant='h6'>{label}</Typography>

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <ImageBox
              name={name}
              multiple={multiple}
              field={field}
              setValue={setValue}
              initialValue={value}
            />
          )}
        />
      </CardContent>
    </Card>
  )
}

export default ImageField