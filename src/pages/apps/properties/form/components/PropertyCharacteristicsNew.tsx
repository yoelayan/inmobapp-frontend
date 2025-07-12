import { useEffect, useCallback, useState } from 'react'

import { type Control, useFieldArray } from 'react-hook-form'

// MUI components
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import type { ICharacteristic } from '@/types/apps/RealtstateTypes'

const defaultValues = {
  characteristics: [] as ICharacteristic[]
}

type PropertyCharacteristicsProps = {
  control: Control<any>
  propertyId: string
  onChange: (characteristics: ICharacteristic[]) => void
}

const PropertyCharacteristics = ({ control, propertyId, onChange }: PropertyCharacteristicsProps) => {
  const [loading, setLoading] = useState(false)

  const { fields, append, remove } = useFieldArray({
    control,
    name: "characteristics",
    keyName: "id" // importante para la estabilidad de las keys
  });

  // Observar cambios en el array de características
  const characteristics = watch("characteristics");

  // Separar características por tipo
  const requiredCharacteristics = fields.filter(field => field.required);
  const optionalCharacteristics = fields.filter(field => !field.required);

  const handleAddCharacteristic = useCallback(
    (characteristicType: ICharacteristic) => {
      append({
        id: characteristicType.id,
        name: characteristicType.name,
        value: '',
        required: characteristicType.required,
        type: characteristicType.type
      })
    },
    [append]
  )

  const handleRemoveCharacteristic = (index: number) => {
    remove(index)
  }

  useEffect(() => {
    const loadCharacteristics = async () => {
      setLoading(true)

      if (propertyId) {
        const characteristics = await getPropertyCharacteristics(propertyId)

        // Actualizar el formulario directamente
        characteristics.forEach(char => {
          append({
            id: char.id,
            name: char.name,
            value: char.value,
            required: char.required,
            type: char.type
          })
        })
      }

      setLoading(false)
    }

    loadCharacteristics()
  }, [propertyId, append])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }
}