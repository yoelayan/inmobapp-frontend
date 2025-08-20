import type { ReactNode } from 'react'

import type { Control, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import type { FilterItem, ResponseAPI, SortingItem } from '@/types/api/response.ts'

import type {
  TextFieldProps as MuiTextFieldProps,
} from '@mui/material'
import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox'
import type { InputProps as MuiInputProps } from '@mui/material/Input'

import type { z } from 'zod'

export type FormRepository = {
  base_url: string
  get(id: number): Promise<any>
  create(data: Record<string, any>): Promise<any>
  update(id: number, data: Record<string, any>): Promise<any>
}

export interface BaseFormProps<T extends FieldValues> {
  schema: (() => z.ZodSchema<T>) | z.ZodSchema<T>
  defaultValues?: Partial<T>
  repository?: FormRepository
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  children: ReactNode
  mode?: 'create' | 'edit'
  entityId?: number
  setFormData?: (data: any, methods: UseFormReturn<T>) => void
}

export interface FormFieldBaseProps<T extends FieldValues> {
  name: FieldPath<T>
  label: string
  control?: Control<T>
  disabled?: boolean
  required?: boolean
}

export type TextFieldProps<T extends FieldValues> = FormFieldBaseProps<T> & MuiTextFieldProps & {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  placeholder?: string
  multiline?: boolean
  rows?: number
}

export type SelectFieldProps<T extends FieldValues> = FormFieldBaseProps<T> & MuiTextFieldProps & {
  options: Array<{ value: string | number | undefined; label: string }>
  multiple?: boolean
  placeholder?: string
}

export type DateFieldProps<T extends FieldValues> = FormFieldBaseProps<T> & MuiTextFieldProps & {
  disablePast?: boolean
  disableFuture?: boolean
  format?: string
}

export type CheckboxFieldProps<T extends FieldValues> = FormFieldBaseProps<T> & MuiCheckboxProps & {
  label: string
}

export type FileFieldProps<T extends FieldValues> = FormFieldBaseProps<T> & MuiInputProps & {
  accept?: string
  multiple?: boolean
  helperText?: string
}

export type ImageFieldProps<T extends FieldValues> = FormFieldBaseProps<T> & MuiInputProps & {
  accept?: string
  helperText?: string
  previewSize?: number
  currentImageUrl?: string
}

export type AsyncSelectOption = {
  value: string | number | undefined
  label: string
}

export type AsyncLoadFunction<T = any> = (params?: {
  page: number
  pageSize: number
  filters: FilterItem[]
  sorting: SortingItem[]
}) => Promise<ResponseAPI<T>>

export interface AsyncSelectFieldProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  refreshData: AsyncLoadFunction
  placeholder?: string
  noOptionsText?: string
  loadingText?: string
  minSearchLength?: number
  debounceTime?: number
  multiple?: boolean
  freeSolo?: boolean
  options?: AsyncSelectOption[]
  loading?: boolean
  fullWidth?: boolean
}

export type PermissionsFieldProps<T extends FieldValues> = FormFieldBaseProps<T> & {
  showGroups?: boolean
  showSearch?: boolean
  showFilters?: boolean
  collapsible?: boolean
}

export type FormContainerProps = {
  title?: string
  subtitle?: string
  children: ReactNode
  loading?: boolean
}


export type FormMode = 'create' | 'edit'
export type ContainerType = 'page' | 'modal' | 'stepper'
