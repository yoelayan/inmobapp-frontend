'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

// Fields
import SelectFieldAsync from '@/components/form/SelectFieldAsync'
import CustomTextField from '@core/components/mui/TextField'
import SelectField from '@/components/form/SelectField'

// Types imports
import type { Cliente } from '@/types/apps/ClientesTypes'

// Hooks
import useClientForm from './hooks/useClientForm'
import useClients from '@/hooks/api/crm/useClients'
import useFranchises from '@/hooks/api/realstate/useFranchises'
import useClientStatus from '@/hooks/api/crm/useClientStatus'

import { Controller } from 'react-hook-form'
import { FieldError } from 'react-hook-form'

import { useNotification } from '@/hooks/useNotification'
import { useParams, useRouter } from 'next/navigation'



interface ClientFormProps {
    id?: string
}



const ClientForm: React.FC<ClientFormProps> = ({ id }) => {

    const {
        fetchItemById: fetchClient,
        createData: createClient,
        updateData: updateClient,
        item: client,
    } = useClients()

    const router = useRouter()

    const {
        data: franchises,
        refreshData: refreshFranchises,
        fetchData: fetchFranchises
    } = useFranchises()
    const {
        data: clientStatus,
        refreshData: refreshClientStatus,
        fetchData: fetchClientStatus
    } = useClientStatus()


    const [isUpdate, setIsUpdate] = useState(id ? true : false)
    const { notify } = useNotification()


    const {
        control, handleSubmit, errors,
        setValue, getValues, getFormattedValues
    } = useClientForm()

    const setDefaultValues = (client: Cliente) => {
        // Recorrer el objeto y asignar los valores a cada campo

        Object.entries(client).forEach(([key, value]) => {
            if (value !== null) {
                if (typeof value === 'object' && value.id && value.nombre) {
                    setValue(key as any, {
                        value: value.id,
                        label: value.nombre
                    })
                } else {
                    setValue(key as any, value)
                }
            }
        })


    }

    useEffect(() => {
        fetchFranchises()
        fetchClientStatus()
        if (id) {
            fetchClient(id)

        }
    }, [id])

    useEffect(() => {
        if (client) {
            setDefaultValues(client)
        }
    }, [client])




    const onSubmit = () => {
        const data = getFormattedValues()
        console.log(data)

        try {
            if (isUpdate && client) {
                updateClient(client.id, data)
                notify('Cliente actualizado con éxito', 'success')
                return
            } else {
                createClient(data)
                notify('Cliente creado con éxito', 'success')
                if (client) {
                    return
                }
            }


        } catch (error) {
            notify('Error al crear el Cliente', 'error')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid size={8}>
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                size={12}
                                columns={{ xs: 4, sm: 8, md: 12 }}
                                direction={'row'}
                                spacing={2}
                            >
                                <Grid size={12}>
                                    <SelectFieldAsync
                                        name='franquicia'
                                        control={control}
                                        label='Franquicia'
                                        error={errors.franquicia as FieldError}
                                        setValue={setValue}
                                        value={getValues('franquicia')}
                                        refreshData={refreshFranchises}
                                        response={franchises}
                                        dataMap={{ value: 'id', label: 'nombre' }}
                                    />
                                </Grid>
                                
                                <Grid size={6}>
                                    <Controller
                                        name='email'
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                label='Email'
                                                {...field}
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <Controller
                                        name='numero_telefono'
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                label='Número de Teléfono'
                                                {...field}
                                                error={!!errors.numero_telefono}
                                                helperText={errors.numero_telefono?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Box sx={{ position: 'fixed', top: 95, width: '24%' }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={12}>
                                            <Controller
                                                name='nombre'
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomTextField
                                                        fullWidth
                                                        label='Nombre del Cliente'
                                                        {...field}
                                                        error={!!errors.nombre}
                                                        helperText={errors.nombre?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <SelectField
                                                name='status'
                                                control={control}
                                                label='Status'
                                                error={errors.status as FieldError}
                                                setValue={setValue}
                                                value={getValues('status')}
                                                response={clientStatus}
                                                dataMap={{ value: 'id', label: 'nombre' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button fullWidth type='submit' color='primary' variant='contained'>
                                    Guardar
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </form>
    )
}

export { ClientForm }
