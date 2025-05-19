import { custom, pipe, any, string, object } from 'valibot'

export const select = (message: string = '') => {
  if (!message) {
    message = 'Debe seleccionar un elemento'
  }

  return object(
    {
      value: any(),
      label: any()
    },
    message
  )
}
