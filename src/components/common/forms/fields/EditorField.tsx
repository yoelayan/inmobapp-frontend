// React Imports
import React, { useEffect } from 'react'

// Third-party Imports
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import classnames from 'classnames'

// MUI Imports
import { Box, Typography, Divider, FormHelperText } from '@mui/material'

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
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Typography variant='h6' className="mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Typography>
          <EditorComponent
            value={field.value || ''}
            onChange={field.onChange}
            placeholder={placeholder}
            disabled={disabled}
            minHeight={minHeight}
            maxHeight={maxHeight}
            {...props}
          />
          {error && (
            <FormHelperText error className="mt-1">
              {error.message}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  )
}

interface EditorComponentProps {
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
    <Box className="border border-gray-300 rounded-md overflow-hidden">
      <EditorToolbar editor={editor} disabled={disabled} />
      <Divider />
      <Box className="p-4">
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
  if (!editor) {
    return null
  }

  const buttonClass = "transition-colors duration-200"
  const activeClass = "bg-primary-100 text-primary-600"
  const inactiveClass = "text-gray-600 hover:bg-gray-100"

  return (
    <div className='flex flex-wrap gap-x-2 gap-y-1 p-3 bg-gray-50'>
      {/* Bold Button */}
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={classnames(buttonClass, {
          [activeClass]: editor.isActive('bold'),
          [inactiveClass]: !editor.isActive('bold')
        })}
      >
        <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>

      {/* Italic Button */}
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={classnames(buttonClass, {
          [activeClass]: editor.isActive('italic'),
          [inactiveClass]: !editor.isActive('italic')
        })}
      >
        <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>

      {/* Underline Button */}
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={classnames(buttonClass, {
          [activeClass]: editor.isActive('underline'),
          [inactiveClass]: !editor.isActive('underline')
        })}
      >
        <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>

      {/* Strike Button */}
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={classnames(buttonClass, {
          [activeClass]: editor.isActive('strike'),
          [inactiveClass]: !editor.isActive('strike')
        })}
      >
        <i className={classnames('tabler-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>

      <Divider orientation="vertical" className="mx-1" />

      {/* Text Alignment Buttons */}
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={classnames(buttonClass, {
          [activeClass]: editor.isActive({ textAlign: 'left' }),
          [inactiveClass]: !editor.isActive({ textAlign: 'left' })
        })}
      >
        <i
          className={classnames('tabler-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })}
        />
      </CustomIconButton>

      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={classnames(buttonClass, {
          [activeClass]: editor.isActive({ textAlign: 'center' }),
          [inactiveClass]: !editor.isActive({ textAlign: 'center' })
        })}
      >
        <i
          className={classnames('tabler-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>

      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={classnames(buttonClass, {
          [activeClass]: editor.isActive({ textAlign: 'right' }),
          [inactiveClass]: !editor.isActive({ textAlign: 'right' })
        })}
      >
        <i
          className={classnames('tabler-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>

      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        disabled={disabled}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={classnames(buttonClass, {
          [activeClass]: editor.isActive({ textAlign: 'justify' }),
          [inactiveClass]: !editor.isActive({ textAlign: 'justify' })
        })}
      >
        <i
          className={classnames('tabler-align-justified', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton>
    </div>
  )
}
