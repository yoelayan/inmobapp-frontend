# Patrones de Testing Reutilizables

Esta guía contiene patrones y buenas prácticas para crear tests consistentes y reutilizables en el proyecto.

## Estructura de Archivos

```
src/
├── tests/
│   ├── __mocks__/
│   │   ├── components.tsx    # Mocks de componentes
│   │   ├── hooks.ts          # Mocks de hooks
│   │   └── repositories.ts   # Mocks de repositorios
│   ├── utils/
│   │   ├── test-utils.tsx    # Utilidades de testing
│   │   └── page-test-utils.tsx # Utilidades específicas para páginas
│   └── patterns/
│       ├── templates/        # Templates de tests
│       └── examples/         # Ejemplos de uso
└── app/
    └── (dashboard)/
        └── [entity]/
            └── __tests__/
                └── page.test.tsx
```

## Patrones Principales

### 1. Patrón de Test de Página Lista (List Page)

```typescript
/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/tests/utils/test-utils'
import { setupHookMocks } from '@/tests/__mocks__/hooks'
import '@/tests/__mocks__/components'
import EntityListPage from '../page'

describe('Entity List Page', () => {
  beforeEach(() => {
    setupHookMocks()
  })

  it('should render without crashing', () => {
    render(<EntityListPage />)
    expect(screen.getByTestId('mock-entity-table')).toBeInTheDocument()
  })

  it('should display correct title', () => {
    render(<EntityListPage />)
    expect(screen.getByText('Entity Title')).toBeInTheDocument()
  })

  it('should render action buttons', () => {
    render(<EntityListPage />)
    expect(screen.getByText('Agregar Entity')).toBeInTheDocument()
  })
})
```

### 2. Patrón de Test de Página de Formulario (Form Page)

```typescript
/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/tests/utils/test-utils'
import { setupHookMocks } from '@/tests/__mocks__/hooks'
import '@/tests/__mocks__/components'
import AddEntityPage from '../page'

describe('Add Entity Page', () => {
  beforeEach(() => {
    setupHookMocks()
  })

  it('should render without crashing', () => {
    render(<AddEntityPage />)
    expect(screen.getByTestId('mock-entityform')).toBeInTheDocument()
  })

  it('should render section header', () => {
    render(<AddEntityPage />)
    expect(screen.getByTestId('mock-sectionheader')).toBeInTheDocument()
  })
})
```

### 3. Patrón de Test de Página de Vista (View Page)

```typescript
/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, waitFor } from '@/tests/utils/test-utils'
import { setupHookMocks, setupLoadingMocks, setupErrorMocks } from '@/tests/__mocks__/hooks'
import { setupRepositoryMocks } from '@/tests/__mocks__/repositories'
import '@/tests/__mocks__/components'
import ViewEntityPage from '../page'

const mockParams = { id: '1' }

describe('View Entity Page', () => {
  beforeEach(() => {
    setupHookMocks()
    setupRepositoryMocks()
    jest.clearAllMocks()
  })

  it('should render without crashing', async () => {
    render(<ViewEntityPage params={mockParams} />)
    await waitFor(() => {
      expect(screen.getByTestId('mock-card')).toBeInTheDocument()
    })
  })

  it('should display loading state', async () => {
    setupLoadingMocks()
    render(<ViewEntityPage params={mockParams} />)
    
    await waitFor(() => {
      expect(screen.getByText(/cargando/i)).toBeInTheDocument()
    })
  })

  it('should display error state', async () => {
    setupErrorMocks()
    render(<ViewEntityPage params={mockParams} />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

## Mejores Prácticas

### 1. Estructura de Tests

- **Agrupación clara**: Use `describe` blocks para agrupar tests relacionados
- **Nombres descriptivos**: Use nombres que describan claramente qué se está probando
- **Setup consistente**: Use `beforeEach` para configurar mocks

### 2. Mocking Strategy

- **Mock por defecto**: Configure mocks con datos válidos por defecto
- **Estados específicos**: Use funciones helper para configurar estados específicos (loading, error)
- **Limpieza**: Limpie mocks entre tests con `jest.clearAllMocks()`

### 3. Testing Patterns

- **Render básico**: Siempre teste que el componente renderiza sin errores
- **Contenido esperado**: Verifique que el contenido esperado esté presente
- **Interacciones**: Teste interacciones del usuario cuando sea relevante
- **Estados**: Teste diferentes estados (loading, error, success)

### 4. Assertions Comunes

```typescript
// Verificar que un elemento existe
expect(screen.getByTestId('element-id')).toBeInTheDocument()

// Verificar texto
expect(screen.getByText('Expected Text')).toBeInTheDocument()

// Verificar que no existe
expect(screen.queryByText('Not Present')).not.toBeInTheDocument()

// Verificar con regex
expect(screen.getByText(/pattern/i)).toBeInTheDocument()

// Verificar roles
expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
```

## Utilidades Disponibles

### Test Utils

```typescript
import { render, screen, waitFor } from '@/tests/utils/test-utils'
import { TestDataFactory } from '@/tests/utils/test-utils'

// Crear datos de prueba
const user = TestDataFactory.user()
const franchise = TestDataFactory.franchise()
const tableData = TestDataFactory.tableData([user])
```

### Mock Utilities

```typescript
import { setupHookMocks, setupLoadingMocks, setupErrorMocks } from '@/tests/__mocks__/hooks'
import { setupRepositoryMocks } from '@/tests/__mocks__/repositories'

// Configurar mocks
setupHookMocks()
setupRepositoryMocks()

// Estados específicos
setupLoadingMocks()
setupErrorMocks()
```

### Page Test Utilities

```typescript
import { PageTestHelper, testListPage, testFormPage, testViewPage } from '@/tests/utils/page-test-utils'

// Helper para tests complejos
const helper = new PageTestHelper({
  component: MyComponent,
  expectedElements: {
    titles: ['Title'],
    buttons: ['Submit'],
  }
})

await helper.runAllTests()
```

## Checklist para Nuevos Tests

- [ ] Crear directorio `__tests__` en la carpeta de la página
- [ ] Usar el template apropiado (list, form, view)
- [ ] Configurar mocks necesarios
- [ ] Escribir tests básicos (render, contenido)
- [ ] Agregar tests de estado (loading, error)
- [ ] Verificar cobertura de código
- [ ] Ejecutar tests y verificar que pasen

## Comandos Útiles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests específicos
npm test -- --testPathPattern=usuarios

# Ejecutar tests con verbose output
npm test -- --verbose
```

## Ejemplos de Uso

Ver los archivos en `src/tests/patterns/examples/` para ejemplos completos de implementación de cada patrón. 
