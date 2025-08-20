import type React from 'react'

import { Box } from '@mui/material'

import type { FieldValues } from 'react-hook-form'

import type {
  TextFieldProps, SelectFieldProps, DateFieldProps,
  CheckboxFieldProps, FileFieldProps, ImageFieldProps, AsyncSelectFieldProps
} from '@/types/common/forms.types'

import { TextField } from '@components/common/forms/fields/TextField'
import { SelectField } from '@components/common/forms/fields/SelectField'
import { DateField } from '@components/common/forms/fields/DateField'
import { CheckboxField } from '@components/common/forms/fields/CheckboxField'
import { FileField } from '@components/common/forms/fields/FileField'
import { ImageField } from '@components/common/forms/fields/ImageField'
import AsyncSelectField from '@components/common/forms/fields/AsyncSelectField'

type FormFieldProps<T extends FieldValues> =
  | ({ type?: 'text' | 'email' | 'password' | 'number' | 'tel' } & TextFieldProps<T>)
  | ({ type: 'select' } & SelectFieldProps<T>)
  | ({ type: 'date' } & DateFieldProps<T>)
  | ({ type: 'checkbox' } & CheckboxFieldProps<T>)
  | ({ type: 'file' } & FileFieldProps<T>)
  | ({ type: 'image' } & ImageFieldProps<T>)
  | ({ type: 'async-select' } & AsyncSelectFieldProps<T>)


export const FormField = <T extends FieldValues>(props: FormFieldProps<T>) => {


  const Component = (props: FormFieldProps<T>) => {
    switch (props.type) {
      case 'select':
        return <SelectField {...props} />
      case 'date':
        return <DateField {...props} />
      case 'checkbox':
        return <CheckboxField {...props} />
      case 'file':
        return <FileField {...props} />
      case 'image':
        return <ImageField {...props} />
      case 'async-select':
        return <AsyncSelectField {...props} />
      default:
        return <TextField {...props} />
    }
  }

  return (
    <Box mb={2} px={0} py={0}>
      <Component {...props} />
    </Box>
  )
}
