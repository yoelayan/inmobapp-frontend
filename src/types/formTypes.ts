import { Control, FieldError, UseFormGetValues, UseFormSetValue } from "react-hook-form"

export interface FormProps {
    control: Control<any>
    errors: { [key: string]: FieldError }
    setValue: UseFormSetValue<any>
    getValues: UseFormGetValues<any>
}

export interface FormField {
    name: string
    Component: any
    label: string
    props?: any
}
