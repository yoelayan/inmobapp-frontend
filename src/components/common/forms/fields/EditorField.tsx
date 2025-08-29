// React Imports
import React, { useEffect } from 'react'

// Third-party Imports
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

// MUI Imports
import { Box, Typography, Divider, FormHelperText, useTheme } from '@mui/material'

// React Hook Form Imports
import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'

// Components
import CustomIconButton from '@core/components/mui/IconButton'

// Types
import type { EditorFieldProps } from '@/types/common/forms.types'

// Styles
import '@/libs/styles/tiptapEditor.css'

export const EditorField = <T extends FieldValues>({
  name,
  label,
  placeholder = 'Escribe aquí...',
  disabled = false,
  required = false,
  minHeight = 200,
  maxHeight = 400,
  ...props
}: EditorFieldProps<T>) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const editorId = `editor-${name}`

        return (
          <Box>
            <Box component="label" htmlFor={editorId} sx={{ mb: 2, display: 'block' }}>
              <Typography variant='h6' component="span">
                {label}
                {required && <span className="text-red-500">*</span>}
              </Typography>
            </Box>
            <EditorComponent
              id={editorId}
              value={field.value || ''}
              onChange={field.onChange}
              placeholder={placeholder}
              disabled={disabled}
              minHeight={minHeight}
              maxHeight={maxHeight}
              {...props}
            />
            {error && (
              <FormHelperText error sx={{ mt: 1 }}>
                {error.message}
              </FormHelperText>
            )}
          </Box>
        )
      }}
    />
  )
}

interface EditorComponentProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: number
  maxHeight?: number
}

const EditorComponent = ({
  value,
  onChange,
  placeholder = 'Escribe aquí...',
  disabled = false,
  minHeight = 200,
  maxHeight = 400
}: EditorComponentProps) => {
  const theme = useTheme()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    content: value,
    editable: !disabled,
    onUpdate({ editor }) {
      const html = editor.getHTML()

      if (html !== value) {
        onChange(html)
      }
    },
    editorProps: {
      attributes: {
        class: 'editor-content prose max-w-none focus:outline-none',
        style: `min-height: ${minHeight}px; max-height: ${maxHeight}px; overflow-y: auto;`
      }
    }
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [disabled, editor])

  return (
    <Box
      sx={{
        border: '1px solid',  // ← Borde más fino
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.12)'  // ← Borde sutil en modo oscuro
          : 'rgba(0, 0, 0, 0.08)',       // ← Borde sutil en modo claro
        borderRadius: 1,  // ← Radio más pequeño
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper
      }}
    >
      <EditorToolbar editor={editor} disabled={disabled} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}

const EditorToolbar = ({
  editor,
  disabled = false
}: {
  editor: Editor | null
  disabled?: boolean
}) => {
  const theme = useTheme()

  if (!editor) {
    return null
  }

  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      p: 1.5,
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      borderBottom: 1,
      borderColor: theme.palette.divider
    }}> {/* TODO: usar styled para el box */}
      {/* Bold Button */}
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        sx={{
          transition: 'all 0.2s',
          ...(editor.isActive('bold') && {
            bgcolor: 'primary.100',
            color: 'primary.600'
          }),
          ...(!editor.isActive('bold') && {
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover
            }
          })
        }}
      >
        <i className="tabler-bold" />
      </CustomIconButton>

      {/* Italic Button */}
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        sx={{
          transition: 'all 0.2s',
          ...(editor.isActive('italic') && {
            bgcolor: 'primary.100',
            color: 'primary.600'
          }),
          ...(!editor.isActive('italic') && {
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover
            }
          })
        }}
      >
        <i className="tabler-italic" />
      </CustomIconButton>

      {/* Underline Button */}
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        sx={{
          transition: 'all 0.2s',
          ...(editor.isActive('underline') && {
            bgcolor: 'primary.100',
            color: 'primary.600'
          }),
          ...(!editor.isActive('underline') && {
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover
            }
          })
        }}
      >
        <i className="tabler-underline" />
      </CustomIconButton>

      {/* Strike Button */}
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        sx={{
          transition: 'all 0.2s',
          ...(editor.isActive('strike') && {
            bgcolor: 'primary.100',
            color: 'primary.600'
          }),
          ...(!editor.isActive('strike') && {
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover
            }
          })
        }}
      >
        <i className="tabler-strikethrough" />
      </CustomIconButton>

      <Divider orientation="vertical" sx={{ mx: 0.5 }} />

      {/* Text Alignment Buttons */}
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        sx={{
          transition: 'all 0.2s',
          ...(editor.isActive({ textAlign: 'left' }) && {
            bgcolor: 'primary.100',
            color: 'primary.600'
          }),
          ...(!editor.isActive({ textAlign: 'left' }) && {
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover
            }
          })
        }}
      >
        <i className="tabler-align-left" />
      </CustomIconButton>

      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        sx={{
          transition: 'all 0.2s',
          ...(editor.isActive({ textAlign: 'center' }) && {
            bgcolor: 'primary.100',
            color: 'primary.600'
          }),
          ...(!editor.isActive({ textAlign: 'center' }) && {
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover
            }
          })
        }}
      >
        <i className="tabler-align-center" />
      </CustomIconButton>

      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        sx={{
          transition: 'all 0.2s',
          ...(editor.isActive({ textAlign: 'right' }) && {
            bgcolor: 'primary.100',
            color: 'primary.600'
          }),
          ...(!editor.isActive({ textAlign: 'right' }) && {
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover
            }
          })
        }}
      >
        <i className="tabler-align-right" />
      </CustomIconButton>

      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        sx={{
          transition: 'all 0.2s',
          ...(editor.isActive({ textAlign: 'justify' }) && {
            bgcolor: 'primary.100',
            color: 'primary.600'
          }),
          ...(!editor.isActive({ textAlign: 'justify' }) && {
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: theme.palette.action.hover
            }
          })
        }}
      >
        <i className="tabler-align-justified" />
      </CustomIconButton>
    </Box>
  )
}
