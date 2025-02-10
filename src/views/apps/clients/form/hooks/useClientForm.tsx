import { useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import {
    object,
    minLength,
    number,
    string,
    pipe,
    nonEmpty,
    mimeType,
    blob,
    maxSize,
    minValue,
    array,
    email,
} from 'valibot'

import type { InferInput } from 'valibot'

import { editorMinLength } from '@components/form/validators/editorMinLength'
import { select } from '@components/form/validators/select'

const schema = object({
    /*
    nombre: '',
      email: '',
      franquicia: null,
      status: 1,
      tipo: 'email',
      valor: ''

    */
    nombre: pipe(string(), minLength(1, 'Máximo 200 caracteres')),
    email: pipe(string(), email(), nonEmpty()),
    franquicia: select(),
    status: select(),
    numero_telefono: pipe(string(), minLength(1, 'Máximo 200 caracteres')),

})

type FormData = InferInput<typeof schema>

const usePropertyForm = (defaultValues?: FormData) => {
    const initValues = {
        nombre: '',
        email: '',
        franquicia: {
            value: 'None'
        },
        status: {
            value: 'None'
        },
        numero_telefono: ''
    }

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        getValues
    } = useForm<FormData>({
        resolver: valibotResolver(schema),
        defaultValues: initValues
    })

    // crear metodo que obtenga los valores y los formatee para enviarlos al backend

    const getFormattedValues = () => {
        const values = getValues()

        return {
            ...values,
            franquicia: values.franquicia.value,
            status: values.status.value
        }
    }


    useEffect(() => {
        reset(defaultValues)
    }, [defaultValues, reset])

    return {
        control,
        reset,
        handleSubmit,
        errors,
        setError,
        setValue,
        getValues,
        getFormattedValues
    }
}

export default usePropertyForm
