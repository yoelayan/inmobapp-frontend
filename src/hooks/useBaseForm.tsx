import { useEffect, useState, useCallback } from 'react'

import type {
  SubmitHandler,
  FieldErrors,
  UseFormReset,
  UseFormSetError,
  UseFormClearErrors,
  Control,
  UseFormWatch,
  UseFormSetValue,
  Path,
  UseFormGetValues
} from 'react-hook-form'

import { useForm } from 'react-hook-form'

import type { AxiosError } from 'axios' // Assuming Axios is used by your ApiClient/Repository

// Define a generic interface for repository methods
interface IBaseRepository<TData, TId, TPayload> {
  get: (id: TId) => Promise<TData>
  create: (payload: TPayload) => Promise<TData>
  update: (id: TId, payload: TPayload) => Promise<TData>
}

// Define the parameters for the hook
interface UseBaseFormOptions<TData, TFormData extends Record<string, any>, TId, TPayload> {
  id?: TId // Optional ID for update mode
  repository: IBaseRepository<TData, TId, TPayload>
  defaultValues: Partial<TFormData> | undefined // Default values for creation mode
  transformDataForForm: (backendData: TData) => Partial<TFormData> // Function to map backend data to form data
  preparePayload?: (formData: TFormData) => TPayload // Optional function to transform form data before sending
  onSuccess?: (data: TData, isUpdate: boolean) => void // Optional success callback
  onError?: (error: any) => void // Optional error callback
  notificationHook: { notify: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void } // Pass notification hook
}

// Define the return type of the hook
interface UseBaseFormReturn<TFormData extends Record<string, any>> {
  control: Control<TFormData>
  handleSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>
  errors: FieldErrors<TFormData>
  isSubmitting: boolean
  isLoading: boolean // Loading state for initial data fetch
  serverError: string | null // General server errors
  reset: UseFormReset<TFormData>
  setValue: UseFormSetValue<TFormData>
  watch: UseFormWatch<TFormData>
  isUpdateMode: boolean
  setError: UseFormSetError<TFormData>
  clearErrors: UseFormClearErrors<TFormData>
  getValues: UseFormGetValues<TFormData>
}

export function useBaseForm<
  TData,
  TFormData extends Record<string, any>,
  TId extends string | number,
  TPayload = TFormData // Default payload type is the form data itself
>({
  id,
  repository,
  defaultValues,
  transformDataForForm,
  preparePayload = data => data as unknown as TPayload, // Default payload preparation (identity)
  onSuccess,
  onError,
  notificationHook
}: UseBaseFormOptions<TData, TFormData, TId, TPayload>): UseBaseFormReturn<TFormData> {
  const [isLoading, setIsLoading] = useState<boolean>(!!id) // Start loading only if in update mode
  const [serverError, setServerError] = useState<string | null>(null)
  const isUpdateMode = !!id
  const { notify } = notificationHook

  const {
    control,
    handleSubmit: rhfHandleSubmit, // Rename to avoid conflict
    reset,
    setError,
    setValue,
    clearErrors,
    watch,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<TFormData>({
    defaultValues: defaultValues as any // Set initial defaults
  })

  // --- Fetch Initial Data for Update Mode ---
  const fetchInitialData = useCallback(async () => {
    if (id) {
      setIsLoading(true)
      setServerError(null)

      try {
        const backendData = await repository.get(id)
        const formData = transformDataForForm(backendData) as TFormData

        reset(formData)
      } catch (error: any) {
        notify('Error al cargar los datos iniciales.', 'error')
        if (onError) onError(error)
      } finally {
        setIsLoading(false)
      }
    } else {
      const formData = defaultValues as TFormData

      reset(formData) // Ensure defaults are set for creation mode
      setIsLoading(false)
    }
  }, [id, repository, transformDataForForm, reset, notify, onError, defaultValues])

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData]) // Depend only on the memoized fetch function

  // --- Handle Backend Validation Errors ---
  const handleBackendErrors = useCallback(
    (
      backendErrors: Record<string, string | string[]>,
      formData: TFormData,
      rhfSetError: UseFormSetError<TFormData>
    ) => {
      let generalError = ''

      Object.keys(backendErrors).forEach(field => {
        const message = Array.isArray(backendErrors[field])
          ? (backendErrors[field] as string[]).join(', ')
          : (backendErrors[field] as string)

        if (field in formData) {
          rhfSetError(field as Path<TFormData>, {
            type: 'server',
            message: message
          })
        } else if (field === 'non_field_errors' || field === 'detail') {
          generalError = generalError ? `${generalError}\n${message}` : message
        } else {
          // Log unexpected errors but try to show them generally
          console.warn(`Backend error for unknown field "${field}": ${message}`)
          generalError = generalError ? `${generalError}\n${field}: ${message}` : `${field}: ${message}`
        }
      })

      if (generalError) {
        setServerError(generalError)
        notify(generalError, 'error') // Notify general errors as well
      }
    },
    [notify]
  )

  // --- Form Submission Logic ---
  const processSubmit: SubmitHandler<TFormData> = useCallback(
    async formData => {
      setServerError(null)
      const payload = preparePayload(formData)

      try {
        let response: TData

        if (id) {
          // --- Update ---
          response = await repository.update(id, payload)

          notify('Registro actualizado con éxito', 'success')

          reset(formData)
        } else {
          // --- Create ---
          response = await repository.create(payload)

          notify('Registro creado con éxito', 'success')

          reset(defaultValues as TFormData) // Reset to defaults after successful creation
        }


        if (onSuccess) onSuccess(response, isUpdateMode)

        return response
      } catch (error: any) {
        console.error('Error submitting form:', error)

        // Check specifically for AxiosError with 400 status and data
        const axiosError = error as AxiosError<Record<string, string | string[]>>

        if (axiosError.isAxiosError && axiosError.response?.status === 400 && axiosError.response?.data) {
          handleBackendErrors(axiosError.response.data, formData, setError)
        } else {
          const message = error.response?.data?.detail || error.message || 'Ocurrió un error inesperado.'

          setServerError(message)
          notify(message, 'error')
        }

        if (onError) onError(error)
        throw error // Ensure RHF knows the submission failed
      }
    },
    [
      id,
      repository,
      preparePayload,
      notify,
      reset,
      defaultValues,
      onSuccess,
      onError,
      isUpdateMode,
      handleBackendErrors,
      setError
    ]
  )

  return {
    control,
    handleSubmit: rhfHandleSubmit(processSubmit), // Wrap processSubmit with RHF's handler
    errors,
    isSubmitting,
    isLoading,
    serverError,
    reset,
    setValue,
    watch,
    clearErrors,
    setError,
    isUpdateMode,
    getValues
  }
}
