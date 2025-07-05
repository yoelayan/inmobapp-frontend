// React Hook form
import type { FieldError, UseFormSetValue, Control } from 'react-hook-form'

export default interface FieldProps {
  value: any
  label: string
  name: string
  control: Control<any>
  error?: FieldError
  setValue: UseFormSetValue<any>
  disabled?: boolean
}
