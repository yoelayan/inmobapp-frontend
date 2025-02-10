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
  array
} from 'valibot'

import type { InferInput } from 'valibot'

import { editorMinLength } from '@components/form/validators/editorMinLength'
import { select } from '@components/form/validators/select'

const schema = object({
  nombre: pipe(
    string('Se requiere un nombre'),
    nonEmpty('Este campo es requerido'),
    minLength(3, 'El nombre debe tener al menos 3 caracteres')
  ),
  status_inmueble: select(),
  descripcion: pipe(
    string('Se requiere una descripción'),
    editorMinLength(10, 'La descripción debe tener al menos 10 caracteres')
  ),
  images: array(
    pipe(
      blob(),
      maxSize(1024 * 1024 * 10, 'La imagen no debe pesar más de 10MB'),
      mimeType(['image/png', 'image/jpeg'], 'Solo se permiten imagenes PNG y JPEG')
    )
  ),
  first_image_url: array(
    pipe(
      blob(),
      maxSize(1024 * 1024 * 10, 'La imagen no debe pesar más de 10MB'),
      mimeType(['image/png', 'image/jpeg'], 'Solo se permiten imagenes PNG y JPEG')
    )
  ),
  tipoPropiedad: select(),
  franquicia: select(),
  negociacion: select(),
  estado: select(),
  ciudad: select(),
  antiguedadInmueble: select(),
  amoblado: select(),
  cliente: select(),
  direccion: string('Se requiere una dirección'),
  mts2: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0')),
  mts2Construidos: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0')),
  plantas: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0')),
  habitaciones: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0')),
  banos: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0')),
  banosServicio: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0')),
  habitacionesServicio: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0')),
  ptosEstacionamiento: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0')),
  precioVenta: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0')),
  precioAlquiler: pipe(number('Se requiere un valor numérico'), minValue(0, 'El valor mínimo es 0'))
})

type FormData = InferInput<typeof schema>

const usePropertyForm = (defaultValues?: FormData) => {
  const initValues = {
    nombre: '',
    status_inmueble: {
      value: 'None'
    },
    descripcion: '',
    imagenes: [],
    first_image_url: [],
    estado: {
      value: 'None'
    },
    ciudad: {
      value: 'None'
    },
    antiguedadInmueble: {
      value: 'None'
    },
    amoblado: {
      value: 'None'
    },
    tipoPropiedad: {
      value: 'None'
    },
    franquicia: {
      value: 'None'
    },
    negociacion: {
      value: 'None'
    },
    direccion: '',
    mts2: 0,
    mts2Construidos: 0,
    plantas: 0,
    habitaciones: 0,
    banos: 0,
    banosServicio: 0,
    habitacionesServicio: 0,
    ptosEstacionamiento: 0,
    precioVenta: 0,
    precioAlquiler: 0
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
      status_inmueble: values.status_inmueble.value,
      estado: values.estado.value,
      ciudad: values.ciudad.value,
      antiguedad: values.antiguedadInmueble.value,
      amoblado: values.amoblado.value,
      tipoPropiedad: values.tipoPropiedad.value,
      franquicia: values.franquicia.value,
      negociacion: values.negociacion.value,
      cliente: values.cliente.value
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
