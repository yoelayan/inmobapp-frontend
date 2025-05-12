import type { ISearch } from '@/types/apps/ClientesTypes'
import SearchesRepository from '@/api/repositories/crm/SearchesRepository'
import { useNotification } from '@/hooks/useNotification'
import { useBaseForm } from '@/hooks/useBaseForm'

// Form data type
type SearchFormData = ISearch

// Payload type (what the API expects for create/update)
type SearchPayload = ISearch

// Default values for creating a new search
const defaultSearchValues: Partial<SearchFormData> = {
  name: '',
  description: '',
  budget: 0,
  client_id: undefined
}

// Function to transform backend search data (ISearch) into form data (SearchFormData)
const transformSearchDataForForm = (search: ISearch): Partial<SearchFormData> => {
  // Create a copy to avoid modifying the original object if it's cached elsewhere
  const formData: Partial<SearchFormData> = {}

  // Iterate over keys expected in the form data
  for (const key in defaultSearchValues) {
    const formKey = key as keyof SearchFormData
    const searchKey = key as keyof ISearch

    if (search.hasOwnProperty(searchKey)) {
      // Direct assignment for other matching keys
      formData[formKey] = search[searchKey] as any
    }
  }

  return formData
}

export const useSearchForm = (searchId?: string, onSuccess?: (response: ISearch) => void) => {
  const notificationHook = useNotification()

  // Use the base form hook
  const baseForm = useBaseForm<ISearch, SearchFormData, string, SearchPayload>({
    id: searchId,
    repository: SearchesRepository,
    defaultValues: defaultSearchValues,
    transformDataForForm: transformSearchDataForForm,
    notificationHook: notificationHook,
    onSuccess: (response: ISearch) => {
      if (onSuccess) {
        onSuccess(response)
      }
    }
  })

  // Return the result from the base hook
  return baseForm
}
