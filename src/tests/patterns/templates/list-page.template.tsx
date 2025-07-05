/**
 * TEMPLATE: Test para Página de Lista
 *
 * Este es un template para crear tests para páginas de lista.
 * Reemplaza los siguientes placeholders:
 *
 * - {{ENTITY_NAME}} : Nombre de la entidad (ej: Usuario, Franquicia)
 * - {{ENTITY_LOWER}} : Nombre en minúsculas (ej: usuario, franquicia)
 * - {{ENTITY_PLURAL}} : Nombre en plural (ej: Usuarios, Franquicias)
 * - {{ENTITY_PLURAL_LOWER}} : Nombre en plural y minúsculas (ej: usuarios, franquicias)
 * - {{TABLE_TESTID}} : TestId de la tabla (ej: mock-users-table, mock-franchises-table)
 * - {{EXPECTED_TITLE}} : Título esperado en la página
 * - {{ADD_BUTTON_TEXT}} : Texto del botón de agregar
 * - {{EXPECTED_HEADERS}} : Headers esperados en la tabla
 * - {{EXPECTED_DATA}} : Datos de prueba esperados
 */

/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/tests/utils/test-utils'
import { setupHookMocks, setupLoadingMocks, setupErrorMocks } from '@/tests/__mocks__/hooks'
import '@/tests/__mocks__/components'
import {{ENTITY_PLURAL}}Page from '../page'

// Setup mocks
beforeEach(() => {
  setupHookMocks()
})

describe('{{ENTITY_PLURAL}} List Page', () => {
  it('should render without crashing', () => {
    render(<{{ENTITY_PLURAL}}Page />)
    expect(screen.getByTestId('{{TABLE_TESTID}}')).toBeInTheDocument()
  })

  it('should render the {{ENTITY_LOWER}} table component', () => {
    render(<{{ENTITY_PLURAL}}Page />)
    expect(screen.getByTestId('{{TABLE_TESTID}}')).toBeInTheDocument()
  })

  it('should display the correct title', () => {
    render(<{{ENTITY_PLURAL}}Page />)
    expect(screen.getByText('{{EXPECTED_TITLE}}')).toBeInTheDocument()
  })

  it('should render table headers correctly', () => {
    render(<{{ENTITY_PLURAL}}Page />)
    {{EXPECTED_HEADERS}}
  })

  it('should render action buttons', () => {
    render(<{{ENTITY_PLURAL}}Page />)
    expect(screen.getByText('{{ADD_BUTTON_TEXT}}')).toBeInTheDocument()
    expect(screen.getByText('Ver')).toBeInTheDocument()
    expect(screen.getByText('Editar')).toBeInTheDocument()
  })

  it('should render test {{ENTITY_LOWER}} data', () => {
    render(<{{ENTITY_PLURAL}}Page />)
    {{EXPECTED_DATA}}
  })

  it('should match snapshot', () => {
    const { container } = render(<{{ENTITY_PLURAL}}Page />)
    expect(container.firstChild).toMatchSnapshot()
  })
})

// Test with different data states
describe('{{ENTITY_PLURAL}} List Page - Different Data States', () => {
  it('should render correctly with mock data', () => {
    render(<{{ENTITY_PLURAL}}Page />)
    expect(screen.getByTestId('{{TABLE_TESTID}}')).toBeInTheDocument()
  })

  it('should render table structure correctly', () => {
    render(<{{ENTITY_PLURAL}}Page />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('should have correct table content', () => {
    render(<{{ENTITY_PLURAL}}Page />)
    const tableContent = screen.getByTestId('{{ENTITY_PLURAL_LOWER}}-table-content')
    expect(tableContent).toBeInTheDocument()
  })
})

// Test loading and error states
describe('{{ENTITY_PLURAL}} List Page - Loading and Error States', () => {
  it('should display loading state', () => {
    setupLoadingMocks()
    render(<{{ENTITY_PLURAL}}Page />)
    // Add specific loading state assertions if needed
  })

  it('should display error state', () => {
    setupErrorMocks()
    render(<{{ENTITY_PLURAL}}Page />)
    // Add specific error state assertions if needed
  })
})

/*
EJEMPLO DE USO:

Para crear un test para la página de lista de Propiedades:

1. Copiar este template
2. Reemplazar:
   - {{ENTITY_NAME}} → Propiedad
   - {{ENTITY_LOWER}} → propiedad
   - {{ENTITY_PLURAL}} → Propiedades
   - {{ENTITY_PLURAL_LOWER}} → propiedades
   - {{TABLE_TESTID}} → mock-properties-table
   - {{EXPECTED_TITLE}} → Propiedades
   - {{ADD_BUTTON_TEXT}} → Agregar Propiedad
   - {{EXPECTED_HEADERS}} →
     expect(screen.getByText('Título')).toBeInTheDocument()
     expect(screen.getByText('Precio')).toBeInTheDocument()
     expect(screen.getByText('Estado')).toBeInTheDocument()
   - {{EXPECTED_DATA}} →
     expect(screen.getByText('Test Property')).toBeInTheDocument()
     expect(screen.getByText('$100,000')).toBeInTheDocument()

3. Guardar como: src/app/(dashboard)/propiedades/__tests__/page.test.tsx
*/
