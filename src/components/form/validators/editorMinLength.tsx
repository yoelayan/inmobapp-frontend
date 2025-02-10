import { custom, pipe, string } from 'valibot'

export const editorMinLength = (minLength: number, message: string = '') => {
  return pipe(
    string(),
    custom(value => {
      if (!message) {
        message = `El campo debe tener al menos ${minLength} caracteres`
      }

      const editor = new DOMParser().parseFromString(value as string, 'text/html')
      const text = editor.body.textContent || ''

      
return text.length >= minLength
    }, message)
  )
}
