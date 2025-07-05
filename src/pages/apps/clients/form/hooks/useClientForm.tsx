// src/hooks/useClientForm.tsx
import type { IClient } from '@/types/apps/ClientesTypes'
import ClientsRepository from '@/api/repositories/crm/ClientsRepository' // Ensure correct path
import { useNotification } from '@/hooks/useNotification'
import { useBaseForm } from '@/hooks/useBaseForm'

// Form data type (can be the same as before or adjusted)
type ClientFormData = IClient

// Payload type (what the API expects for create/update)
// Often similar to ClientFormData, but adjust if API needs different structure
type ClientPayload = IClient

// Default values for creating a new client
const defaultClientValues: Partial<ClientFormData> = {
  name: '',
  email: '',
  phone: '',
  franchise: undefined, // Or a default franchise ID if applicable
  status: undefined, // Or a default status ID if applicable
  assigned_to: undefined // Or a default user ID
}

// Function to transform backend client data (IClient) into form data (ClientFormData)
const transformClientDataForForm = (client: IClient): Partial<ClientFormData> => {
  // Create a copy to avoid modifying the original object if it's cached elsewhere
  const formData: Partial<ClientFormData> = {}

  // Iterate over keys expected in the form data
  for (const key in defaultClientValues) {
    const formKey = key as keyof ClientFormData
    const clientKey = key as keyof IClient

    if (client.hasOwnProperty(clientKey)) {
      // Direct assignment for other matching keys
      formData[formKey] = client[clientKey] as any
    }
  }

  // You might need to handle specific type conversions here if necessary
  return formData
}

// Optional: Function to prepare payload if it differs from form data
// const prepareClientPayload = (formData: ClientFormData): ClientPayload => {
//   // Example: If API expects status ID directly but form uses object
//   // return { ...formData, status: formData.status?.id };
//   return formData; // If payload is same as form data
// };

export const useClientForm = (clientId?: string, onSuccess?: (response: IClient) => void) => {
  const notificationHook = useNotification()

  // Use the base form hook
  const baseForm = useBaseForm<IClient, ClientFormData, string, ClientPayload>({
    id: clientId,
    repository: ClientsRepository, // Pass the specific repository
    defaultValues: defaultClientValues,
    transformDataForForm: transformClientDataForForm,
    notificationHook: notificationHook,
    onSuccess: (response: IClient) => {
      if (onSuccess) {
        onSuccess(response)
      }
    }
  })

  // Return the result from the base hook
  return baseForm
}
