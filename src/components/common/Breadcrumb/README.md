# Componente Breadcrumb

Un componente completo de navegación breadcrumb para la aplicación InmobApp que maneja rutas dinámicas, traducciones al español y se integra perfectamente con el sistema de diseño MUI + Tailwind.

## Características

- ✅ **Rutas Dinámicas**: Maneja automáticamente rutas con IDs como `/clientes/123/editar`
- ✅ **Traducciones**: Labels en español para todas las rutas
- ✅ **Iconos**: Iconos Tabler para cada sección
- ✅ **Navegación Clickeable**: Elementos navegables donde corresponde
- ✅ **Badges**: Indicadores visuales para acciones (Nuevo, Editar, Ver)
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Temas**: Compatible con modo claro/oscuro
- ✅ **Customizable**: Permite override completo

## Importación

```typescript
// Importar componente principal
import Breadcrumb from '@components/common/Breadcrumb'

// Importar wrapper con estilos adicionales
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

// Importar utilidades
import { 
  getBreadcrumbItems, 
  createBreadcrumbItem, 
  createCommonBreadcrumbs,
  type BreadcrumbItem 
} from '@components/common/Breadcrumb'
```

## Uso Básico

### 1. Automático (Recomendado)

El componente genera automáticamente los breadcrumbs basándose en la URL actual:

```typescript
'use client'
import Breadcrumb from '@components/common/Breadcrumb'

export default function MyPage() {
  return (
    <div>
      <Breadcrumb />
      {/* Resto del contenido */}
    </div>
  )
}
```

### 2. Con Wrapper

Para páginas que necesitan estilos adicionales:

```typescript
'use client'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

export default function MyPage() {
  return (
    <div>
      <BreadcrumbWrapper 
        showContainer={true}
        showDivider={true}
        marginBottom={32}
      />
      {/* Resto del contenido */}
    </div>
  )
}
```

## Ejemplos de Rutas Soportadas

| URL | Breadcrumb Generado |
|-----|-------------------|
| `/home` | `Inicio` |
| `/clientes` | `Inicio > Clientes` |
| `/clientes/123` | `Inicio > Clientes > Cliente #123` |
| `/clientes/123/editar` | `Inicio > Clientes > Cliente #123 > Editar [Badge: Editar]` |
| `/franquicias/456/ver` | `Inicio > Franquicias > Franquicia #456 > Ver [Badge: Ver]` |
| `/propiedades/789` | `Inicio > Propiedades > Propiedad #789` |
| `/usuarios/101/editar` | `Inicio > Usuarios > Usuario #101 > Editar [Badge: Editar]` |
| `/clientes/123/coincidencias` | `Inicio > Clientes > Cliente #123 > Coincidencias` |
| `/clientes/busquedas/456` | `Inicio > Clientes > Búsquedas > Búsqueda #456` |

## Ejemplos de Integración

### En Layout de Dashboard

```typescript
// src/app/(dashboard)/layout.tsx
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavBar />
      <main>
        <BreadcrumbWrapper showDivider={true} marginBottom={24} />
        {children}
      </main>
    </div>
  )
}
```

### En Página Específica

```typescript
// src/app/(dashboard)/clientes/[id]/page.tsx
'use client'
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'
import { ClientForm } from '@/pages/apps/clients/form/ClientForm'

export default function ClientPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <BreadcrumbWrapper />
      <ClientForm clientId={params.id} />
    </div>
  )
}
```

### Con Breadcrumbs Personalizados

```typescript
'use client'
import { Breadcrumb, createCommonBreadcrumbs } from '@components/common/Breadcrumb'

export default function CustomPage() {
  const customBreadcrumbs = [
    createCommonBreadcrumbs.home(),
    createCommonBreadcrumbs.clients(),
    createCommonBreadcrumbs.clientDetail('123'),
    { label: 'Configuración Especial', icon: 'tabler-settings' }
  ]

  return (
    <div>
      <Breadcrumb customItems={customBreadcrumbs} />
      {/* Contenido personalizado */}
    </div>
  )
}
```

## Props del Componente

### Breadcrumb

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `customItems` | `BreadcrumbItem[]` | `undefined` | Override los breadcrumbs automáticos |
| `showHome` | `boolean` | `true` | Mostrar enlace de inicio |
| `maxItems` | `number` | `8` | Máximo número de elementos |
| `className` | `string` | `''` | Clases CSS adicionales |
| `separator` | `React.ReactNode` | `'/'` | Separador entre elementos |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño del texto |

### BreadcrumbWrapper

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `showContainer` | `boolean` | `false` | Mostrar como Paper/Card |
| `showDivider` | `boolean` | `true` | Mostrar línea divisoria |
| `padding` | `string \| number` | `16` | Padding del contenedor |
| `marginBottom` | `string \| number` | `24` | Margen inferior |
| `elevation` | `number` | `0` | Elevación del Paper |
| ...todas las props de Breadcrumb | | | |

## Utilidades Disponibles

### `getBreadcrumbItems(pathname: string)`

Genera automáticamente los elementos del breadcrumb desde una ruta:

```typescript
const items = getBreadcrumbItems('/clientes/123/editar')
// Resultado: [
//   { label: 'Clientes', href: '/clientes', icon: 'tabler-users' },
//   { label: 'Cliente #123', icon: 'tabler-user' },
//   { label: 'Editar', icon: 'tabler-edit', badge: 'Editar' }
// ]
```

### `createBreadcrumbItem(label, href?, icon?, badge?)`

Crea un elemento breadcrumb personalizado:

```typescript
const item = createBreadcrumbItem(
  'Mi Página', 
  '/mi-pagina', 
  'tabler-star', 
  'Nuevo'
)
```

### `createCommonBreadcrumbs`

Helpers para crear breadcrumbs comunes:

```typescript
// Ejemplos disponibles
createCommonBreadcrumbs.home()
createCommonBreadcrumbs.clients()
createCommonBreadcrumbs.clientDetail('123')
createCommonBreadcrumbs.clientEdit('123')
createCommonBreadcrumbs.franchises()
createCommonBreadcrumbs.properties()
createCommonBreadcrumbs.users()
// ... y más
```

## Personalización

### Agregar Nuevas Rutas

Edita `src/components/common/Breadcrumb/utils.ts`:

```typescript
const routeLabels: Record<string, string> = {
  // ... rutas existentes
  'mi-nueva-seccion': 'Mi Nueva Sección',
  'configuraciones': 'Configuraciones'
}

const routeIcons: Record<string, string> = {
  // ... iconos existentes
  'mi-nueva-seccion': 'tabler-new-icon',
  'configuraciones': 'tabler-settings'
}
```

### Estilos Personalizados

El componente usa clases de Tailwind CSS que puedes override:

```typescript
<Breadcrumb 
  className="my-custom-breadcrumb bg-gray-100 p-4 rounded-lg"
  size="large"
/>
```

## Integración con Layouts Existentes

### Layout Vertical

```typescript
// En VerticalLayout
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

<VerticalLayout>
  <BreadcrumbWrapper marginBottom={16} />
  {children}
</VerticalLayout>
```

### Layout Horizontal

```typescript
// En HorizontalLayout  
import { BreadcrumbWrapper } from '@components/common/Breadcrumb'

<HorizontalLayout>
  <BreadcrumbWrapper 
    showContainer={true} 
    elevation={1}
    marginBottom={24}
  />
  {children}
</HorizontalLayout>
```

## Notas Técnicas

- Compatible con Next.js App Router
- Usa `usePathname()` para detectar la ruta actual
- Maneja IDs numéricos y UUIDs automáticamente
- Los elementos clickeables solo aparecen donde tiene sentido navegar
- El último elemento nunca es clickeable (página actual)
- Compatible con modo claro/oscuro del tema MUI 
