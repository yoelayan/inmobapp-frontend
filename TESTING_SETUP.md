# Configuración de Testing en Jest

Este documento describe la configuración completa de testing implementada en el proyecto utilizando Jest y React Testing Library siguiendo estándares de buenas prácticas.

## 🚀 Resumen de lo Implementado

### ✅ Configuración Base
- **Jest Configuration**: Configuración completa con Next.js (`jest.config.ts`)
- **Test Environment**: jsdom para testing de componentes React
- **TypeScript Support**: Soporte completo para TypeScript
- **Module Mapping**: Aliases de paths configurados

### ✅ Dependencias Instaladas
```json
{
  "@testing-library/dom": "^10.4.0",
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^16.1.0",
  "@testing-library/user-event": "^14.5.2",
  "@types/jest": "^29.5.14",
  "identity-obj-proxy": "^3.0.0",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",
  "ts-jest": "^29.2.5",
  "ts-node": "^10.9.2"
}
```

### ✅ Scripts de Testing
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:ci": "jest --ci --coverage --watchAll=false"
}
```

### ✅ Estructura de Archivos Implementada
```
src/
├── tests/
│   ├── setup.ts                    # Configuración global de Jest
│   ├── __mocks__/
│   │   ├── fileMock.ts             # Mock para archivos estáticos
│   │   ├── components.tsx          # Mocks de componentes
│   │   ├── hooks.ts                # Mocks de hooks
│   │   └── repositories.ts         # Mocks de repositorios
│   ├── utils/
│   │   ├── test-utils.tsx          # Utilidades de testing
│   │   └── page-test-utils.tsx     # Utilidades para páginas
│   └── patterns/
│       ├── README.md               # Guía de patrones
│       ├── templates/              # Templates reutilizables
│       │   ├── list-page.template.tsx
│       │   ├── form-page.template.tsx
│       │   └── view-page.template.tsx
│       └── generate-test.js        # Script de generación automática
└── app/(dashboard)/
    ├── usuarios/__tests__/page.test.tsx           # Tests de usuarios
    ├── usuarios/agregar/__tests__/page.test.tsx
    ├── usuarios/[id]/ver/__tests__/page.test.tsx
    ├── franquicias/__tests__/page.test.tsx        # Tests de franquicias
    ├── franquicias/agregar/__tests__/page.test.tsx
    └── franquicias/[id]/ver/__tests__/page.test.tsx
```

## 🛠 Utilidades Implementadas

### Test Utils (`src/tests/utils/test-utils.tsx`)
- **Custom Render**: Función de render con providers (ThemeProvider, etc.)
- **Test Data Factories**: Factorías para crear datos de prueba
- **Mock Utilities**: Helpers para crear mocks
- **Navigation Mocks**: Mocks para Next.js navigation

### Page Test Utils (`src/tests/utils/page-test-utils.tsx`)
- **PageTestHelper**: Clase helper para tests complejos
- **Test Patterns**: Funciones para tests de lista, formulario y vista
- **CRUD Test Suite**: Función para crear suites completas de CRUD

### Mocks Implementados
- **Components**: Mocks para componentes comunes (Card, Button, etc.)
- **Hooks**: Mocks para hooks de API
- **Repositories**: Mocks para repositorios
- **Navigation**: Mocks para Next.js router y navigation

## 📝 Patrones de Test Implementados

### 1. **List Page Pattern**
Para páginas de listado con tablas
```typescript
describe('Entity List Page', () => {
  it('should render table', () => {
    render(<EntityListPage />)
    expect(screen.getByTestId('mock-entity-table')).toBeInTheDocument()
  })
})
```

### 2. **Form Page Pattern**
Para páginas de formularios (agregar/editar)
```typescript
describe('Add Entity Page', () => {
  it('should render form', () => {
    render(<AddEntityPage />)
    expect(screen.getByTestId('mock-entityform')).toBeInTheDocument()
  })
})
```

### 3. **View Page Pattern**
Para páginas de detalle/vista
```typescript
describe('View Entity Page', () => {
  it('should display entity data', async () => {
    render(<ViewEntityPage params={{id: '1'}} />)
    await waitFor(() => {
      expect(screen.getByText('Entity Name')).toBeInTheDocument()
    })
  })
})
```

## 🎯 Tests Implementados

### Usuarios
- ✅ Lista de usuarios (`/usuarios`)
- ✅ Agregar usuario (`/usuarios/agregar`)
- ✅ Ver usuario (`/usuarios/[id]/ver`)

### Franquicias
- ✅ Lista de franquicias (`/franquicias`)
- ✅ Agregar franquicia (`/franquicias/agregar`)
- ✅ Ver franquicia (`/franquicias/[id]/ver`)

## 🚀 Generación Automática de Tests

### Script Generator (`src/tests/patterns/generate-test.js`)
```bash
# Generar test de lista
node generate-test.js list propiedades

# Generar test de formulario
node generate-test.js form clientes --action=add

# Generar test de vista
node generate-test.js view usuarios
```

### Entidades Configuradas
- usuarios
- franquicias
- clientes
- propiedades

## 📋 Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests específicos
npm test -- --testPathPattern=usuarios

# Ejecutar con verbose output
npm test -- --verbose

# Generar test automáticamente
node src/tests/patterns/generate-test.js list propiedades
```

## 🎨 Características Destacadas

### ✅ **Reutilización**
- Templates reutilizables para diferentes tipos de páginas
- Factories para datos de prueba
- Mocks configurables para diferentes estados

### ✅ **Buenas Prácticas**
- Tests aislados con mocks apropiados
- Configuración de setup/teardown
- Snapshots para regresión visual
- Coverage configurado

### ✅ **Escalabilidad**
- Patrones fácilmente replicables
- Script de generación automática
- Configuración modular

### ✅ **Mantenibilidad**
- Documentación completa
- Ejemplos de uso
- Estructura organizada

## 🔧 Próximos Pasos

Para crear tests para nuevas páginas:

1. **Usar Script Automático**:
   ```bash
   node src/tests/patterns/generate-test.js list nuevaentidad
   ```

2. **Usar Templates Manualmente**:
   - Copiar template apropiado
   - Reemplazar placeholders
   - Ajustar assertions específicas

3. **Agregar Mocks Necesarios**:
   - Actualizar `src/tests/__mocks__/` si es necesario
   - Configurar datos de prueba específicos

4. **Ejecutar y Verificar**:
   ```bash
   npm test -- --testPathPattern=nuevaentidad
   ```

## 📚 Referencias

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**✨ La configuración está lista para usar. ¡Puedes empezar a escribir tests inmediatamente!** 
