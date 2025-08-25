import React from 'react';

import AsyncSelect from 'react-select/async';
import { useTheme } from '@mui/material/styles';

import { Controller, useFormContext } from 'react-hook-form';
import { type TextFieldProps as MUITextFieldProps, FormHelperText, InputLabel, FormControl } from '@mui/material'

import type { FieldValues } from 'react-hook-form'

import debounce from '@/utils/debounce'

import type { AsyncSelectFieldProps } from '@/types/common/forms.types'

const AsyncSelectField = <T extends FieldValues, V extends MUITextFieldProps>({
  name,
  label,
  repository,
  onChange,
  filters,
  disabled
}: AsyncSelectFieldProps<T> & V) => {
  const { control } = useFormContext()
  const theme = useTheme()

  const buildFilters = () => {
    // convertir la lista de filters en un objeto
    const filtersObject = filters?.reduce((acc: any, filter: any) => {
      acc[filter.field] = filter.value

      return acc as any
    }, {})

    return filtersObject
  }

  const loadOptions = debounce(async (inputValue: string, callback: (options: any[]) => void) => {
    const response = await repository.getAll({
      page: 1,
      pageSize: 10,
      search: inputValue,
      ...buildFilters()
    })

    const options = response.results?.map(state => ({ value: state.id, label: state.name })) || []

    callback(options)
  }, 500)


  // Custom styles for react-select that follow MUI theme
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused
        ? theme.palette.primary.main
        : theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.22)'
          : 'rgba(47, 43, 61, 0.22)',
      borderRadius: theme.shape.borderRadius,
      borderWidth: '1px',
      minHeight: '56px',
      marginTop: '16px', // Add margin for the label space
      fontSize: '1rem',
      fontFamily: theme.typography.fontFamily,
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : theme.palette.background.paper,
      color: theme.palette.text.primary,
      boxShadow: state.isFocused
        ? `0 0 0 2px ${theme.palette.primary.main}25`
        : 'none',
      '&:hover': {
        borderColor: state.isFocused
          ? theme.palette.primary.main
          : theme.palette.action.active,
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: theme.palette.text.primary,
      fontSize: '1rem',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: theme.palette.text.secondary,
      fontSize: '1rem',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: theme.palette.text.primary,
      fontSize: '1rem',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[8],
      zIndex: 9999,
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: '8px 0',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? theme.palette.primary.main
        : state.isFocused
          ? theme.palette.action.hover
          : 'transparent',
      color: state.isSelected
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary,
      padding: '12px 16px',
      fontSize: '1rem',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected
          ? theme.palette.primary.main
          : theme.palette.action.hover,
      },
    }),
    noOptionsMessage: (provided: any) => ({
      ...provided,
      color: theme.palette.text.secondary,
      fontSize: '1rem',
      padding: '12px 16px',
    }),
    loadingMessage: (provided: any) => ({
      ...provided,
      color: theme.palette.text.secondary,
      fontSize: '1rem',
      padding: '12px 16px',
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: theme.palette.divider,
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.text.primary,
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.text.primary,
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '8px 16px',
    }),
  }

  return (
    <FormControl className='w-full' variant='outlined'>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange: onChangeField, value }, fieldState: { error } }) => (
          <>
            <InputLabel
              shrink={true}

              error={!!error}
            >
              {label}
            </InputLabel>
            <AsyncSelect
              isDisabled={disabled}
              className='react-select-container'
              classNamePrefix='react-select'
              cacheOptions
              defaultOptions
              loadOptions={loadOptions}
              onChange={(option: any) => {
                onChangeField(option)

                if (onChange) {
                  onChange({ label: option?.label, value: option?.value })
                }
              }}
              value={value}
              styles={customSelectStyles}
              placeholder='Seleccionar...'
              noOptionsMessage={() => 'No se encontraron opciones'}
              loadingMessage={() => 'Cargando...'}
              isClearable
              isSearchable
              theme={selectTheme => ({
                ...selectTheme,
                borderRadius: theme.shape.borderRadius,
                colors: {
                  ...selectTheme.colors,
                  primary: theme.palette.primary.main,
                  primary75: theme.palette.primary.light,
                  primary50: theme.palette.primary.light + '80',
                  primary25: theme.palette.primary.light + '40',
                  danger: theme.palette.error.main,
                  dangerLight: theme.palette.error.light,
                  neutral0: theme.palette.background.paper,
                  neutral5: theme.palette.action.hover,
                  neutral10: theme.palette.action.selected,
                  neutral20: theme.palette.divider,
                  neutral30: theme.palette.text.disabled,
                  neutral40: theme.palette.text.secondary,
                  neutral50: theme.palette.text.secondary,
                  neutral60: theme.palette.text.primary,
                  neutral70: theme.palette.text.primary,
                  neutral80: theme.palette.text.primary,
                  neutral90: theme.palette.text.primary
                }
              })}
            />
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </>
        )}
      />
    </FormControl>
  )
}

export default AsyncSelectField;
