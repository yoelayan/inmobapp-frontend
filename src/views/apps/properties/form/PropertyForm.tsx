'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import { ThemeProvider } from '@mui/material/styles'

// Types imports
import type { Propiedad } from '@/types/apps/PropiedadesTypes'

// Hooks
import useTab from './hooks/useTab'
import usePropertyForm from './hooks/usePropertyForm'
import useProperties from '@/hooks/api/properties/useProperties'
import { useNotification } from '@/hooks/useNotification'
import { useParams } from 'next/navigation'

// Tabs
import InfoTab from './components/InfoTab'
import FeaturesTab from './components/FeaturesTab'
import CommunAreasTab from './components/CommunAreasTab'
import SellDataTab from './components/SellDataTab'
import ClienDataTab from './components/ClienDataTab'

// Sidebar
import Sidebar from './components/Sidebar'

export interface PropertyTabProps {
    control: any
    errors: any
    setValue: any
    getValues: any
}

interface PropertyFormProps {
    id?: string
}



const PropertyForm: React.FC<PropertyFormProps> = ({ id }) => {

    const { 
        fetchItemById: fetchProperty,
        createData: createProperty,
        updateData: updateProperty,
        item: property,
    } = useProperties()


    const [isUpdate, setIsUpdate] = useState(id ? true : false)
    const { notify } = useNotification()



    const { currentTab, handleTabChange } = useTab('info')

    const { 
        control, handleSubmit, errors,
        setValue, getValues, getFormattedValues
    } = usePropertyForm()

    const setDefaultValues = (property: Propiedad) => {
        // Recorrer el objeto y asignar los valores a cada campo

        Object.entries(property).forEach(([key, value]) => {
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
        if (id) {
            fetchProperty(id)
            
        }
    }, [id])

    useEffect(() => {
        if (property) {
            setDefaultValues(property)
        }
    }, [property])




    const onSubmit = () => {
        const data = getFormattedValues()
        console.log(data)
        
        try {
            if (isUpdate && property) {
                updateProperty(property.id, data)
                notify('Propiedad actualizada con éxito', 'success')
                return
            } else {
                createProperty(data)
                notify('Propiedad creada con éxito', 'success')
                if (property){
                    window.location.href = `/propiedades/actualizar/${property.id}`
                }
            }
            
                
        } catch (error) {
            notify('Error al crear la propiedad', 'error')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid size={8}>
                    <Card>
                        <CardContent>
                            <Divider />
                            <TabContext value={currentTab}>
                                <TabList variant='scrollable' onChange={handleTabChange} className='border-be'>
                                    <Tab label='Panel de Información' value='info' />
                                    <Tab label='Datos de Negociación' value='negotiation_data' />
                                    <Tab label='Características' value='features' />
                                    <Tab label='Áreas Comunes' value='common_areas' />
                                    
                                    <Tab label='Datos de Cliente' value='client_data' />
                                </TabList>
                                <TabPanel value='info'>
                                    <InfoTab control={control} errors={errors} setValue={setValue} getValues={getValues} />
                                </TabPanel>
                                <TabPanel value='features'>
                                    <FeaturesTab control={control} errors={errors} setValue={setValue} getValues={getValues} />
                                </TabPanel>
                                <TabPanel value='common_areas'>
                                    <CommunAreasTab control={control} errors={errors} setValue={setValue} getValues={getValues} />
                                </TabPanel>
                                <TabPanel value='negotiation_data'>
                                    <SellDataTab control={control} errors={errors} setValue={setValue} getValues={getValues} />
                                </TabPanel>
                                <TabPanel value='client_data'>
                                    <ClienDataTab control={control} errors={errors} setValue={setValue} getValues={getValues} />
                                </TabPanel>
                            </TabContext>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Sidebar control={control} errors={errors} setValue={setValue} getValues={getValues} />
                </Grid>
            </Grid>
        </form>
    )
}

export { PropertyForm }
