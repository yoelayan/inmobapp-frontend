'use client'

// React Imports
import React from 'react'

// MUI Imports
import { Box, Typography, Paper } from '@mui/material'

// Component Imports
import { Breadcrumb, createCommonBreadcrumbs, createBreadcrumbItem } from '../index'

/**
 * Ejemplo de breadcrumb personalizado
 *
 * Este ejemplo muestra cómo crear breadcrumbs personalizados
 * para casos donde el automático no es suficiente
 */
const CustomBreadcrumbExample: React.FC = () => {
  // Ejemplo 1: Breadcrumb completamente personalizado
  const customBreadcrumbs = [
    createCommonBreadcrumbs.home(),
    createCommonBreadcrumbs.clients(),
    createBreadcrumbItem('Configuración Avanzada', undefined, 'tabler-settings-cog'),
    createBreadcrumbItem('Filtros Especiales', undefined, 'tabler-filter', 'Nuevo')
  ]

  // Ejemplo 2: Breadcrumb mixto (algunos automáticos, algunos custom)
  const mixedBreadcrumbs = [
    createCommonBreadcrumbs.home(),
    createCommonBreadcrumbs.properties(),
    createCommonBreadcrumbs.propertyDetail('789'),
    createBreadcrumbItem('Documentos', '/propiedades/789/documentos', 'tabler-file-text'),
    createBreadcrumbItem('Contrato', undefined, 'tabler-file-invoice', 'PDF')
  ]

  // Ejemplo 3: Breadcrumb para workflow complejo
  const workflowBreadcrumbs = [
    createCommonBreadcrumbs.home(),
    createCommonBreadcrumbs.franchises(),
    createCommonBreadcrumbs.franchiseDetail('456'),
    createBreadcrumbItem('Reportes', '/franquicias/456/reportes', 'tabler-chart-bar'),
    createBreadcrumbItem('Ventas', '/franquicias/456/reportes/ventas', 'tabler-trending-up'),
    createBreadcrumbItem('Mensual', undefined, 'tabler-calendar', 'Enero 2024')
  ]

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Ejemplos de Breadcrumbs Personalizados
      </Typography>

      {/* Ejemplo 1 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Breadcrumb Completamente Personalizado
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Para páginas especiales que no siguen el patrón estándar de rutas
        </Typography>
        <Breadcrumb
          customItems={customBreadcrumbs}
          size="medium"
        />
      </Paper>

      {/* Ejemplo 2 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          2. Breadcrumb Mixto
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Combina elementos estándar con personalizados
        </Typography>
        <Breadcrumb
          customItems={mixedBreadcrumbs}
          size="medium"
        />
      </Paper>

      {/* Ejemplo 3 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          3. Breadcrumb para Workflow Complejo
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Para procesos multi-paso con contexto específico
        </Typography>
        <Breadcrumb
          customItems={workflowBreadcrumbs}
          size="medium"
          maxItems={6}
        />
      </Paper>

      {/* Ejemplo 4: Diferentes tamaños */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          4. Diferentes Tamaños
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={1}>
          Pequeño:
        </Typography>
        <Breadcrumb
          customItems={customBreadcrumbs}
          size="small"
          className="mb-4"
        />

        <Typography variant="body2" color="text.secondary" mb={1}>
          Mediano (default):
        </Typography>
        <Breadcrumb
          customItems={customBreadcrumbs}
          size="medium"
          className="mb-4"
        />

        <Typography variant="body2" color="text.secondary" mb={1}>
          Grande:
        </Typography>
        <Breadcrumb
          customItems={customBreadcrumbs}
          size="large"
        />
      </Paper>

      {/* Ejemplo 5: Sin home */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          5. Sin Enlace de Inicio
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Para contextos donde no se necesita el enlace de inicio
        </Typography>
        <Breadcrumb
          customItems={[
            createCommonBreadcrumbs.clients(),
            createCommonBreadcrumbs.clientDetail('123'),
            createBreadcrumbItem('Configuración', undefined, 'tabler-settings')
          ]}
          showHome={false}
          size="medium"
        />
      </Paper>

      {/* Ejemplo 6: Separador personalizado */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          6. Separador Personalizado
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Con separador de flecha en lugar de "/"
        </Typography>
        <Breadcrumb
          customItems={customBreadcrumbs}
          separator="→"
          size="medium"
        />
      </Paper>
    </Box>
  )
}

export default CustomBreadcrumbExample
