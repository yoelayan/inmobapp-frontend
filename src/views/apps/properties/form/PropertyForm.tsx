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
import { IRealProperty } from '@/types/apps/RealtstateTypes'

// Hooks
import useTab from './hooks/useTab'
import usePropertyForm from './hooks/usePropertyForm'
import useProperties from '@/hooks/api/realstate/useProperties'
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
import { on } from 'events'

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
        loading,
        errors: errorsProperty,
        error
    } = useProperties()


    const [isUpdate, setIsUpdate] = useState(id ? true : false)
    const { notify } = useNotification()



    const { currentTab, handleTabChange } = useTab('info')

    const { 
        control, handleSubmit, errors, setError,
        setValue, getValues, getFormattedValues
    } = usePropertyForm()

    useEffect(() => {
        if (id) {
            fetchProperty(id)
            
        }
    }, [id])

    useEffect(() => {
        
        if (errorsProperty){
            notify('No se ha podido crear la propiedad', 'error')
            Object.keys(errorsProperty).forEach(key => {
                setError(key as any, {
                    type: 'manual',
                    message: errorsProperty[key][0]
                })
            })
        }
    }, [error])



    const onError = async () => {
        return error
    }

    const onSubmit = async (e: any) => {
        e.preventDefault()
        const data = await getFormattedValues()
        
        try {
            if (isUpdate && property) {
                await updateProperty(property.id, data)
                notify('Propiedad actualizada con éxito', 'success')
                return
            } else {
                await createProperty(data)
                notify('Propiedad creada con éxito', 'success')
                
            }
            
                
        } catch (error) {
            notify('Error al crear la propiedad', 'error')
        }
    }

    return (
        // prevent default
        <form onSubmit={e => onSubmit(e)}>
            <Grid container spacing={2}>
                <Grid size={{
                    md: 8,
                    xs: 12,
                    sm: 12
                }}>
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
                <Grid size={{
                    md: 4,
                    xs: 12,
                    sm: 12
                }}>
                    <Sidebar control={control} errors={errors} setValue={setValue} getValues={getValues} />
                </Grid>
            </Grid>
        </form>
    )
}

export { PropertyForm }
