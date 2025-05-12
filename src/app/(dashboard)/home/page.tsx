'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Component Imports
import CardStatHorizontal from '@/components/card-statistics/Horizontal'
import HorizontalWithBorder from '@/components/card-statistics/HorizontalWithBorder'
import CardStatsWithAreaChart from '@/components/card-statistics/StatsWithAreaChart'

// Hook Imports
import useProperties from '@/hooks/api/realstate/useProperties'

// Type Imports
import type { PropertyMetricsFilters } from '@/types/apps/RealtstateMetricsTypes'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

export default function Page() {
  const theme = useTheme()

  const { getMetrics, metricsData: data, metricsLoading: loading } = useProperties()

  const [filters, setFilters] = useState<PropertyMetricsFilters>({
    date_start: '',
    date_end: ''
  })

  useEffect(() => {
    getMetrics()
  }, [])

  const handleDateChange = (field: 'date_start' | 'date_end') => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [field]: event.target.value })
  }

  const handleFilterSubmit = () => {
    getMetrics(filters)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
  }

  // Process monthly data for charts
  const processMonthlyData = () => {
    if (!data?.results?.monthly_data) return { months: [], propertyCount: [], sellCount: [], rentCount: [], sellBenefit: [], rentBenefit: [] }

    const months: string[] = []
    const propertyCount: number[] = []
    const sellCount: number[] = []
    const rentCount: number[] = []
    const sellBenefit: number[] = []
    const rentBenefit: number[] = []

    // Sort the months in chronological order
    const sortedMonthKeys = Object.keys(data.results.monthly_data).sort()

    sortedMonthKeys.forEach(monthKey => {
      const monthData = data.results.monthly_data[monthKey]

      // Format month for display (YYYY-MM to Mon YYYY or just abbreviated month name)
      const monthParts = monthKey.split('-')
      const month = monthParts[1]
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      const formattedMonth = monthNames[parseInt(month) - 1]

      months.push(formattedMonth)
      propertyCount.push(monthData.total_count)
      sellCount.push(monthData.sell_count)
      rentCount.push(monthData.rent_count)
      sellBenefit.push(monthData.sell_data.benefit)
      rentBenefit.push(monthData.rent_data.benefit)
    })

    return { months, propertyCount, sellCount, rentCount, sellBenefit, rentBenefit }
  }

  const monthlyData = processMonthlyData()

  // Chart options for sell vs rent properties by month
  const sellRentComparisonOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#00AAFF', '#00C853'],
    grid: {
      show: true,
      borderColor: '#E0E0E0',
      padding: { top: 10, bottom: 20 }
    },
    xaxis: {
      categories: monthlyData.months.length > 0 ? monthlyData.months : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#999999' } }
    },
    yaxis: {
      labels: { style: { colors: '#999999' } }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: { width: 8, height: 8, radius: 10 },
      fontSize: '14px',
      labels: { colors: '#757575' },
      itemMargin: { horizontal: 10 }
    }
  }

  // Chart series for sell vs rent properties by month
  const sellRentComparisonSeries = [
    {
      name: 'Propiedades en Venta',
      data: monthlyData.sellCount.length > 0 ? monthlyData.sellCount : [0]
    },
    {
      name: 'Propiedades en Renta',
      data: monthlyData.rentCount.length > 0 ? monthlyData.rentCount : [0]
    }
  ]

  // Chart options for sell vs rent benefits by month
  const benefitsComparisonOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#00AAFF', '#00C853'],
    grid: {
      show: true,
      borderColor: '#E0E0E0',
      padding: { top: 10, bottom: 20 }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: monthlyData.months.length > 0 ? monthlyData.months : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#999999' } }
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
        style: { colors: '#999999' }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: { width: 8, height: 8, radius: 10 },
      fontSize: '14px',
      labels: { colors: '#757575' },
      itemMargin: { horizontal: 10 }
    }
  }

  // Chart series for sell vs rent benefits by month
  const benefitsComparisonSeries = [
    {
      name: 'Beneficios de Venta',
      data: monthlyData.sellBenefit.length > 0 ? monthlyData.sellBenefit : [0]
    },
    {
      name: 'Beneficios de Renta',
      data: monthlyData.rentBenefit.length > 0 ? monthlyData.rentBenefit : [0]
    }
  ]

  if (loading && !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  // Ensure theme and data are ready before rendering charts
  const isReadyToRender = theme && theme.palette && data && data.results;

  if (!isReadyToRender) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  // Generate daily properties data for area chart
  const generateDailyPropertiesData = () => {
    // Return an array with 7 elements representing last 7 days with random increasing values
    // In a real app, this would come from the API
    const startValue = data?.results?.summary?.total_properties_in_range || 0
    const result = []

    for (let i = 0; i < 7; i++) {
      result.push(Math.max(0, startValue - (6 - i)))
    }

    return result
  }

  return (
    <Grid container spacing={6}>
      {/* Filters Section */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title="Métricas de Propiedades" />
          <CardContent>
            <Box display="flex" gap={4} flexWrap="wrap" mb={4}>
              <TextField
                label="Fecha Inicio"
                type="date"
                value={filters.date_start}
                onChange={handleDateChange('date_start')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Fecha Fin"
                type="date"
                value={filters.date_end}
                onChange={handleDateChange('date_end')}
                InputLabelProps={{ shrink: true }}
              />
              <Button variant="contained" color="primary" onClick={handleFilterSubmit}>
                Aplicar Filtros
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Summary Cards */}
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <CardStatHorizontal
          stats={data?.results?.summary?.total_properties.toString() || '0'}
          title="Propiedades Totales"
          avatarIcon="tabler-building-estate"
          avatarColor="primary"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <CardStatHorizontal
          stats={data?.results?.summary?.total_sell_properties.toString() || '0'}
          title="En Venta"
          avatarIcon="tabler-coin"
          avatarColor="success"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <CardStatHorizontal
          stats={data?.results?.summary?.total_rent_properties.toString() || '0'}
          title="En Renta"
          avatarIcon="tabler-home-dollar"
          avatarColor="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <CardStatsWithAreaChart
          stats={(data?.results?.summary?.total_properties || 0).toString()}
          title="Crecimiento de Propiedades"
          avatarIcon="tabler-trending-up"
          avatarColor="info"
          chartSeries={[{
            data: generateDailyPropertiesData()
          }] as any}
        />
      </Grid>

      {/* Benefit Cards */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    mr: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    width: 42,
                    height: 42,
                    backgroundColor: 'success.light'
                  }}
                >
                  <i className="tabler-currency-dollar" style={{ fontSize: '1.5rem', color: 'white' }}></i>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Beneficio Total de Ventas
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(data?.results?.summary?.total_sell_benefit || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Precio promedio: {formatCurrency(data?.results?.summary?.avg_sell_price || 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    mr: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    width: 42,
                    height: 42,
                    backgroundColor: 'warning.light'
                  }}
                >
                  <i className="tabler-cash" style={{ fontSize: '1.5rem', color: 'white' }}></i>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Beneficio Total de Rentas
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(data?.results?.summary?.total_rent_benefit || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Precio promedio: {formatCurrency(data?.results?.summary?.avg_rent_price || 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Property Type Distribution */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card>
          <CardHeader title="Distribución de Propiedades" />
          <CardContent>
            <Box mb={6}>
              <Typography variant="h6" color="text.secondary" mb={2}>
                Propiedades en Venta vs Renta
              </Typography>
              <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h5" color="primary.main">
                    {data?.results?.summary?.total_sell_properties || 0}
                  </Typography>
                  <Typography variant="body2">En Venta</Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h5" color="success.main">
                    {data?.results?.summary?.total_rent_properties || 0}
                  </Typography>
                  <Typography variant="body2">En Renta</Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              <HorizontalWithBorder
                title="Propiedades en Venta"
                stats={data?.results?.summary?.total_sell_properties || 0}
                trendNumber={data?.results?.summary?.total_sell_properties && data?.results?.summary?.total_properties
                  ? Math.round((data.results.summary.total_sell_properties / (data.results.summary.total_properties || 1)) * 100)
                  : 0}
                avatarIcon="tabler-coin"
                color="primary"
              />
            </Box>
            <Box mt={4}>
              <HorizontalWithBorder
                title="Propiedades en Renta"
                stats={data?.results?.summary?.total_rent_properties || 0}
                trendNumber={data?.results?.summary?.total_rent_properties && data?.results?.summary?.total_properties
                  ? Math.round((data.results.summary.total_rent_properties / (data.results.summary.total_properties || 1)) * 100)
                  : 0}
                avatarIcon="tabler-home-dollar"
                color="success"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Sale vs Rent Comparison Chart */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title="Propiedades en Venta vs Renta por Mes" />
          <CardContent>
            {isReadyToRender && (
              <AppReactApexCharts
                type="bar"
                height={350}
                options={sellRentComparisonOptions}
                series={sellRentComparisonSeries}
              />
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Benefits Comparison Chart */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title="Comparación de Beneficios Mensuales" />
          <CardContent>
            {isReadyToRender && (
              <AppReactApexCharts
                type="area"
                height={350}
                options={benefitsComparisonOptions}
                series={benefitsComparisonSeries}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
