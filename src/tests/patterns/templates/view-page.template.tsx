/**
 * TEMPLATE: Test para Página de Vista
 *
 * Este es un template para crear tests para páginas de vista/detalle.
 * Reemplaza los siguientes placeholders:
 *
 * - {{ENTITY_NAME}} : Nombre de la entidad (ej: Usuario, Franquicia)
 * - {{ENTITY_LOWER}} : Nombre en minúsculas (ej: usuario, franquicia)
 * - {{ENTITY_DATA}} : Datos de prueba esperados
 * - {{ENTITY_FIELDS}} : Campos específicos de la entidad
 * - {{LOADING_TEXT}} : Texto de loading específico
 * - {{ERROR_MESSAGE}} : Mensaje de error específico
 * - {{NOT_FOUND_MESSAGE}} : Mensaje cuando no se encuentra la entidad
 */

/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, waitFor } from '@/tests/utils/test-utils'
import { setupHookMocks, setupLoadingMocks, setupErrorMocks } from '@/tests/__mocks__/hooks'
import { setupRepositoryMocks } from '@/tests/__mocks__/repositories'
import '@/tests/__mocks__/components'
import View{{ENTITY_NAME}}Page from '../page'

// Mock the params
const mockParams = { id: '1' }

// Setup mocks
beforeEach(() => {
  setupHookMocks()
  setupRepositoryMocks()
  jest.clearAllMocks()
})

describe('View {{ENTITY_NAME}} Page', () => {
  it('should render without crashing', async () => {
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)
    await waitFor(() => {
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })

  it('should display loading state initially', async () => {
    setupLoadingMocks()
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      expect(screen.getByText(/{{LOADING_TEXT}}/i)).toBeInTheDocument()
    })
  })

  it('should display {{ENTITY_LOWER}} data when loaded', async () => {
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      {{ENTITY_DATA}}
    })
  })

  it('should display error state when error occurs', async () => {
    setupErrorMocks()
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      expect(screen.getByText(/{{ERROR_MESSAGE}}/i)).toBeInTheDocument()
    })
  })

  it('should display {{ENTITY_LOWER}} not found message when {{ENTITY_LOWER}} is null', async () => {
    // Mock empty {{ENTITY_LOWER}} response
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })

  it('should match snapshot', async () => {
    const { container } = render(<View{{ENTITY_NAME}}Page params={mockParams} />)
    await waitFor(() => {
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})

// Test with different {{ENTITY_LOWER}} data
describe('View {{ENTITY_NAME}} Page - Different {{ENTITY_NAME}} Data', () => {
  it('should render {{ENTITY_LOWER}} with different properties', async () => {
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })

  it('should handle invalid {{ENTITY_LOWER}} ID', async () => {
    const invalidParams = { id: 'invalid' }
    render(<View{{ENTITY_NAME}}Page params={invalidParams} />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })

  {{ENTITY_FIELDS}}
})

// Test {{ENTITY_LOWER}} specific fields and states
describe('View {{ENTITY_NAME}} Page - {{ENTITY_NAME}} Specific', () => {
  it('should display {{ENTITY_LOWER}} information correctly', async () => {
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })

  it('should display {{ENTITY_LOWER}} status correctly', async () => {
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })

  it('should display {{ENTITY_LOWER}} metadata', async () => {
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })
})

// Test {{ENTITY_LOWER}} actions and navigation
describe('View {{ENTITY_NAME}} Page - Actions', () => {
  it('should display edit button if available', async () => {
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      // Check for edit action if applicable
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })

  it('should display delete button if available', async () => {
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      // Check for delete action if applicable
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })

  it('should handle back navigation', async () => {
    render(<View{{ENTITY_NAME}}Page params={mockParams} />)

    await waitFor(() => {
      // Check for back navigation if applicable
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })
})

/*
EJEMPLO DE USO:

Para crear un test para la página de vista de Propiedades:

1. Copiar este template
2. Reemplazar:
   - {{ENTITY_NAME}} → Propiedad
   - {{ENTITY_LOWER}} → propiedad
   - {{ENTITY_DATA}} →
     expect(screen.getByText('Casa de Prueba')).toBeInTheDocument()
     expect(screen.getByText('$150,000')).toBeInTheDocument()
     expect(screen.getByText('3 habitaciones')).toBeInTheDocument()
   - {{ENTITY_FIELDS}} →
     it('should display property price', async () => {
       render(<ViewPropertyPage params={mockParams} />)
       await waitFor(() => {
         expect(screen.getByText('$150,000')).toBeInTheDocument()
       })
     })
   - {{LOADING_TEXT}} → cargando datos de la propiedad
   - {{ERROR_MESSAGE}} → error al cargar los datos de la propiedad
   - {{NOT_FOUND_MESSAGE}} → propiedad no encontrada

3. Guardar como: src/app/(dashboard)/propiedades/[id]/ver/__tests__/page.test.tsx

OTRO EJEMPLO PARA CLIENTES:

1. Reemplazar:
   - {{ENTITY_NAME}} → Cliente
   - {{ENTITY_LOWER}} → cliente
   - {{ENTITY_DATA}} →
     expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
     expect(screen.getByText('juan@email.com')).toBeInTheDocument()
     expect(screen.getByText('Activo')).toBeInTheDocument()
   - {{ENTITY_FIELDS}} →
     it('should display client email', async () => {
       render(<ViewClientePage params={mockParams} />)
       await waitFor(() => {
         expect(screen.getByText('juan@email.com')).toBeInTheDocument()
       })
     })
   - {{LOADING_TEXT}} → cargando datos del cliente
   - {{ERROR_MESSAGE}} → error al cargar los datos del cliente
   - {{NOT_FOUND_MESSAGE}} → cliente no encontrado

2. Guardar como: src/app/(dashboard)/clientes/[id]/ver/__tests__/page.test.tsx
*/
