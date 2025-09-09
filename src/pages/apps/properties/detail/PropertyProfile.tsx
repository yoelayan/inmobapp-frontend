import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid2 as Grid,
  Chip,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  Alert,
  CircularProgress,
  Box
} from '@mui/material'

// Icons
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import HomeIcon from '@mui/icons-material/Home'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import BusinessIcon from '@mui/icons-material/Business'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import InfoIcon from '@mui/icons-material/Info'
import DescriptionIcon from '@mui/icons-material/Description'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import BuildIcon from '@mui/icons-material/Build'
import SettingsIcon from '@mui/icons-material/Settings'

// Characteristic icons
import BedIcon from '@mui/icons-material/Bed'
import BathtubIcon from '@mui/icons-material/Bathtub'
import DriveEtaIcon from '@mui/icons-material/DriveEta'
import ApartmentIcon from '@mui/icons-material/Apartment'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import StorageIcon from '@mui/icons-material/Storage'
import ChairIcon from '@mui/icons-material/Chair'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VerifiedIcon from '@mui/icons-material/Verified'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import GroupIcon from '@mui/icons-material/Group'
import MapIcon from '@mui/icons-material/Map'
import QrCodeIcon from '@mui/icons-material/QrCode'
import PercentIcon from '@mui/icons-material/Percent'
import EventIcon from '@mui/icons-material/Event'
import SavingsIcon from '@mui/icons-material/Savings'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'

// Hooks
import useProperties from '@/hooks/api/realstate/useProperties'

// Types
import type { IPropertyCharacteristic } from '@/types/apps/RealtstateTypes'

interface PropertyProfileProps {
  propertyId: string | number
}

// Characteristic icons mapping
const getCharacteristicIcon = (code: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    bedrooms: <BedIcon />,
    bathrooms: <BathtubIcon />,
    garages: <DriveEtaIcon />,
    floors: <ApartmentIcon />,
    land_area: <SquareFootIcon />,
    construction_area: <HomeWorkIcon />,
    total_area: <AspectRatioIcon />,
    cubicle: <ViewInArIcon />,
    storage_room: <StorageIcon />,
    furnished: <ChairIcon />,
    age: <AccessTimeIcon />,
    has_register: <VerifiedIcon />,
    has_mortgage: <AccountBalanceIcon />,
    has_succession: <GroupIcon />,
    has_catastral: <MapIcon />,
    catastral_code: <QrCodeIcon />,
    honor_porcentage: <PercentIcon />,
    month_honor: <EventIcon />,
    month_deposit: <SavingsIcon />,
    month_advance: <EventAvailableIcon />
  }

  return iconMap[code] || <InfoIcon />
}

const PropertyProfile: React.FC<PropertyProfileProps> = ({ propertyId }) => {
  const router = useRouter()
  const { fetchItemById, getAllImages, loading, error, item: property } = useProperties()

  const [images, setImages] = useState<any[]>([])
  const [imagesLoading, setImagesLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)

  // Fetch property images
  const fetchPropertyImages = async () => {
    try {
      setImagesLoading(true)

      const response = await getAllImages(propertyId)
      const imageResults = (response as any).results || []

      // Sort images by order
      const sortedImages = imageResults.sort((a: any, b: any) => {
        const orderA = a.order || 0
        const orderB = b.order || 0

        return orderA - orderB
      })

      setImages(sortedImages)
    } catch (error: any) {
      console.error('Error fetching images:', error)

      // Don't show error notification for images, just log it
    } finally {
      setImagesLoading(false)
    }
  }

  useEffect(() => {
    if (propertyId) {
      fetchItemById(propertyId)
      fetchPropertyImages()
    }
  }, [propertyId, fetchItemById]) // eslint-disable-line react-hooks/exhaustive-deps

  // Format price with currency
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return 'No especificado'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Get characteristic value display
  const getCharacteristicDisplay = (characteristic: IPropertyCharacteristic) => {
    if (!characteristic.characteristic) return ''

    const { type_value } = characteristic.characteristic
    const { value } = characteristic

    switch (type_value) {
      case 'boolean':
        return value ? 'Sí' : 'No'
      case 'integer':
      case 'decimal':
        return value?.toString() || '0'
      case 'text':
      default:
        return value?.toString() || 'No especificado'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <CircularProgress />
        <Typography className="ml-2">Cargando propiedad...</Typography>
      </div>
    )
  }

  if (error || !property) {
    return (
      <Alert severity="error" className="mt-2">
        {error || 'No se pudo cargar la propiedad'}
      </Alert>
    )
  }

  const coverImage = images.length > 0 ? images[0] : null
  const requiredCharacteristics = property.characteristics?.filter(char => char.characteristic?.is_required) || []
  const optionalCharacteristics = property.characteristics?.filter(char => !char.characteristic?.is_required) || []

  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header with title and actions */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
        <Typography variant='h4' component='h1' className='font-bold'>
          {property.name}
        </Typography>
        <Button
          variant='contained'
          startIcon={<EditIcon />}
          onClick={() => router.push(`/propiedades/${propertyId}/editar`)}
          className='min-w-fit'
        >
          Editar Propiedad
        </Button>
      </div>

      {/* Property Code and Status */}
      <div className='flex flex-wrap gap-2 mb-6'>
        <Chip label={`Código: ${property.code}`} variant='outlined' />
        <Chip label={property.type_negotiation?.name || 'Sin tipo'} color='primary' />
        <Chip label={property.type_property?.name || 'Sin categoría'} color='secondary' />
      </div>

      <Grid container spacing={3}>
        {/* Left Column - Images and Description */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Cover Image */}
          {coverImage && (
            <Card className='mb-6 relative overflow-hidden'>
              <CardMedia
                component='img'
                image={coverImage.image}
                alt={`${property.name} - Portada`}
                className='h-64 sm:h-80 md:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300'
                onClick={() => {
                  setSelectedImageIndex(0)
                  setIsFullScreenOpen(true)
                }}
              />
              <div className='absolute top-4 left-4'>
                <Chip label='Portada' color='success' size='small' className='font-bold' />
              </div>
            </Card>
          )}

          {/* Image Carousel */}
          {images.length > 1 && (
            <Card className='mb-6 p-4'>
              <div className='flex items-center gap-2 mb-4'>
                <PhotoLibraryIcon />
                <Typography variant='h6'>Galería de Imágenes ({images.length})</Typography>
              </div>

              {imagesLoading ? (
                <div className='flex justify-center items-center p-4'>
                  <CircularProgress size={24} />
                  <Typography className='ml-2'>Cargando imágenes...</Typography>
                </div>
              ) : (
                <div className='flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
                  {images.map((image, index) => (
                    <Card
                      key={image.id}
                      className='flex-shrink-0 w-40 sm:w-48 md:w-52 h-32 sm:h-36 cursor-pointer overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-200'
                      onClick={() => {
                        setSelectedImageIndex(index)
                        setIsFullScreenOpen(true)
                      }}
                    >
                      <CardMedia
                        component='img'
                        image={image.image}
                        alt={`${property.name} - ${index + 1}`}
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs'>
                        {index + 1}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Description */}
          {property.description && (
            <Card className='mb-6'>
              <CardContent>
                <div className='flex items-center gap-2 mb-4'>
                  <DescriptionIcon />
                  <Typography variant='h6'>Descripción</Typography>
                </div>
                <Typography
                  variant='body1'
                  className='whitespace-pre-wrap leading-relaxed'
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Property Details */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Price Information */}
          <Card className='mb-6'>
            <CardContent>
              <div className='flex items-center gap-2 mb-4'>
                <AttachMoneyIcon />
                <Typography variant='h6'>
                  Información de Precios
                </Typography>
              </div>

              {property.type_negotiation?.name === 'Venta y Alquiler' ? (
                <div className='space-y-3'>
                  {property.price && (
                    <Box className='flex justify-between items-center'>
                      <Typography variant='caption' color="text.secondary">
                        Precio de Venta:
                      </Typography>
                      <Typography variant='h6' className='font-bold'>
                        {formatPrice(property.price)}
                      </Typography>
                    </Box>
                  )}
                  {property.rent_price && (
                    <div className='flex justify-between items-center'>
                      <Typography variant='caption' color="text.secondary">
                        Precio de Alquiler:
                      </Typography>
                      <Typography variant='h6' className='font-bold'>
                        {formatPrice(property.rent_price)}
                      </Typography>
                    </div>
                  )}
                </div>
              ) : property.type_negotiation?.name === 'Venta' && property.price ? (
                <div className='flex justify-between items-center'>
                  <Typography variant='caption' color="text.secondary">
                    Precio de Venta:
                  </Typography>
                  <Typography variant='h6' className='font-bold'>
                    {formatPrice(property.price)}
                  </Typography>
                </div>
              ) : property.type_negotiation?.name === 'Alquiler' && property.rent_price ? (
                <div className='flex justify-between items-center'>
                  <Typography variant='caption' color="text.secondary">
                    Precio de Alquiler:
                  </Typography>
                  <Typography variant='h6' className='font-bold'>
                    {formatPrice(property.rent_price)}
                  </Typography>
                </div>
              ) : (
                <Typography variant='caption' color="text.secondary">
                  Precio no especificado
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Owner Information */}
          {property.owner && (
            <Card className='mb-6'>
              <CardContent>
                <div className='flex items-center gap-2 mb-4'>
                  <PersonIcon />
                  <Typography variant='h6'>
                    Información del Propietario
                  </Typography>
                </div>

                <div className='flex items-center mb-4'>
                  <Avatar className='mr-3 bg-blue-600'>
                    <PersonIcon />
                  </Avatar>
                  <div>
                    <Typography variant='subtitle1' className='font-bold'>
                      {property.owner.name}
                    </Typography>
                    {property.owner.email && (
                      <Typography variant='caption' color="text.secondary">
                        {property.owner.email}
                      </Typography>
                    )}
                  </div>
                </div>

                {property.owner.phone && (
                  <div className='flex items-center'>
                    <Typography variant='caption' color="text.secondary" className='min-w-20'>
                      Teléfono:
                    </Typography>
                    <Typography variant='caption' color="text.secondary" className='font-medium'>
                      {property.owner.phone}
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Location Information */}
          <Card className='mb-6'>
            <CardContent>
              <div className='flex items-center gap-2 mb-4'>
                <LocationOnIcon />
                <Typography variant='h6'>
                  Ubicación
                </Typography>
              </div>

              <div className='space-y-3'>
                {property.state && (
                  <div className='flex items-center gap-3'>
                    <LocationOnIcon className='text-xl' />
                    <div>
                      <Typography variant='caption' color="text.secondary">
                        Estado
                      </Typography>
                      <Typography variant='body1' className='font-medium'>
                        {property.state.name}
                      </Typography>
                    </div>
                  </div>
                )}

                {property.municipality && (
                  <div className='flex items-center gap-3'>
                    <BusinessIcon className='text-xl' />
                    <div>
                      <Typography variant='caption' color="text.secondary">
                        Municipio
                      </Typography>
                      <Typography variant='body1' className='font-medium'>
                        {property.municipality.name}
                      </Typography>
                    </div>
                  </div>
                )}

                {property.parish && (
                  <div className='flex items-center gap-3'>
                    <HomeIcon className='text-xl' />
                    <div>
                      <Typography variant='caption' color="text.secondary">
                        Parroquia
                      </Typography>
                      <Typography variant='body1' className='font-medium'>
                        {property.parish.name}
                      </Typography>
                    </div>
                  </div>
                )}

                {property.address && (
                  <div className='flex items-center gap-3'>
                    <HomeIcon className='text-xl' />
                    <div>
                      <Typography variant='caption' color="text.secondary">
                        Dirección
                      </Typography>
                      <Typography variant='body1' className='font-medium'>
                        {property.address}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assignment and Dates */}
          <Card className='mb-6'>
            <CardContent>
              <div className='flex items-center gap-2 mb-4'>
                <InfoIcon />
                <Typography variant='h6'>
                  Información Adicional
                </Typography>
              </div>

              <div className='space-y-3'>
                {property.assigned_to && (
                  <div className='flex items-center gap-3'>
                    <PersonIcon className='text-xl' />
                    <div>
                      <Typography variant='caption' color="text.secondary">
                        Asignado a
                      </Typography>
                      <Typography variant='body1' className='font-medium'>
                        {property.assigned_to.email || property.assigned_to.name}
                      </Typography>
                    </div>
                  </div>
                )}

                {property.franchise && (
                  <div className='flex items-center gap-3'>
                    <BusinessIcon className='text-xl' />
                    <div>
                      <Typography variant='caption' color="text.secondary">
                        Franquicia
                      </Typography>
                      <Typography variant='body1' className='font-medium'>
                        {property.franchise.name}
                      </Typography>
                    </div>
                  </div>
                )}

                {property.created_at && (
                  <div className='flex items-center gap-3'>
                    <CalendarTodayIcon className='text-xl' />
                    <div>
                      <Typography variant='caption' color="text.secondary">
                        Fecha de Creación
                      </Typography>
                      <Typography variant='body1' className='font-medium'>
                        {new Date(property.created_at).toLocaleDateString('es-ES')}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Characteristics Section */}
      <div className='mt-8'>
        <Grid container spacing={3}>
          {/* Required Characteristics */}
          {requiredCharacteristics.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card className='h-full'>
                <CardContent>
                  <div className='flex items-center gap-2 mb-4'>
                    <BuildIcon />
                    <Typography variant='h6'>
                      Características Principales
                    </Typography>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {requiredCharacteristics.map(char => (
                      <div key={char.id} className='flex items-center gap-3 p-3 rounded-lg'>
                        <div>{getCharacteristicIcon(char.characteristic?.code || '')}</div>
                        <div className='flex-1'>
                          <Typography variant='body2' className='font-medium'>
                            {char.characteristic?.name}
                          </Typography>
                          <Typography variant='body2' >
                            {getCharacteristicDisplay(char)}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Optional Characteristics */}
          {optionalCharacteristics.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card className='h-full'>
                <CardContent>
                  <div className='flex items-center gap-2 mb-4'>
                    <SettingsIcon />
                    <Typography variant='h6'>
                      Características Adicionales
                    </Typography>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {optionalCharacteristics.map(char => (
                      <div key={char.id} className='flex items-center gap-3 p-3 rounded-lg'>
                        <div>{getCharacteristicIcon(char.characteristic?.code || '')}</div>
                        <div className='flex-1'>
                          <Typography variant='body2' className='font-medium'>
                            {char.characteristic?.name}
                          </Typography>
                          <Typography variant='body2' >
                            {getCharacteristicDisplay(char)}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </div>

      {/* Full Screen Image Dialog */}
      <Dialog
        open={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        maxWidth='xl'
        fullWidth
        PaperProps={{
          className: 'bg-black bg-opacity-90 shadow-none'
        }}
      >
        <DialogContent className='p-0 relative'>
          <IconButton
            onClick={() => setIsFullScreenOpen(false)}
            className='absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 z-10'
          >
            <CloseIcon />
          </IconButton>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={() => setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                className='absolute top-1/2 left-4 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 z-10'
              >
                <i className='tabler-chevron-left' />
              </IconButton>
              <IconButton
                onClick={() => setSelectedImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                className='absolute top-1/2 right-4 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 z-10'
              >
                <i className='tabler-chevron-right' />
              </IconButton>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <Typography
              variant='h6'
              className='absolute top-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded z-10'
            >
              {selectedImageIndex + 1} / {images.length}
            </Typography>
          )}

          {/* Current image */}
          {images[selectedImageIndex] && (
            <img
              src={images[selectedImageIndex].image}
              alt={`${property.name} ${selectedImageIndex + 1}`}
              className='w-full h-auto max-h-[90vh] object-contain'
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PropertyProfile
