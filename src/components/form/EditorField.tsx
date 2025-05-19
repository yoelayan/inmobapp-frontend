// React Imports
import React, { useEffect } from 'react'

// Third-party Imports
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import classnames from 'classnames'
import type { Editor } from '@tiptap/core'
import '@/libs/styles/tiptapEditor.css'

// MUI Imports
import { Box, Typography, Divider } from '@mui/material'

import FormHelperText from '@mui/material/FormHelperText'

// React Hook Form Imports
import { Controller } from 'react-hook-form'

import CustomIconButton from '@core/components/mui/IconButton'

import type FieldProps from '@/components/form/BaseField'

interface EditorFieldProps extends FieldProps {}

const EditorField = ({ value, label, name, control, error, setValue }: EditorFieldProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Escribe aquí...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    content: value,
    onUpdate({ editor }) {
      setValue(name, editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'editor-content'
      }
    }
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <Box>
          <Typography variant='h6'>{label}</Typography>
          <EditorToolbar editor={editor} />
          <Divider />
          <EditorContent editor={editor} name={name} />

          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  )
}

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('tabler-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i
          className={classnames('tabler-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
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
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
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
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
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

export default EditorField
