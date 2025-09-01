export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
  badge?: string
}

// Route labels mapping for Spanish translations
const routeLabels: Record<string, string> = {
  // Main sections
  home: 'Inicio',
  about: 'Acerca de',
  clientes: 'Clientes',
  franquicias: 'Franquicias',
  propiedades: 'Propiedades',
  usuarios: 'Usuarios',
  roles: 'Roles',
  ejemplos: 'Ejemplos',

  // Actions
  crear: 'Crear',
  nuevo: 'Nuevo',
  agregar: 'Agregar',
  editar: 'Editar',
  ver: 'Ver',
  detalle: 'Detalle',
  detalles: 'Detalles',
  eliminar: 'Eliminar',
  buscar: 'Buscar',
  busquedas: 'Búsquedas',
  coincidencias: 'Coincidencias',
  matches: 'Coincidencias',

  // Generic terms
  lista: 'Lista',
  listado: 'Listado',
  formulario: 'Formulario',
  perfil: 'Perfil',
  configuracion: 'Configuración',
  configuraciones: 'Configuraciones',
  ajustes: 'Ajustes',

  // Status terms
  activo: 'Activo',
  inactivo: 'Inactivo',
  pendiente: 'Pendiente',
  completado: 'Completado'
}

// Route icons mapping
const routeIcons: Record<string, string> = {
  home: 'tabler-home',
  about: 'tabler-info-circle',
  clientes: 'tabler-users',
  franquicias: 'tabler-building-store',
  propiedades: 'tabler-home-2',
  usuarios: 'tabler-user',
  roles: 'tabler-user',
  ejemplos: 'tabler-code',

  // Actions
  crear: 'tabler-plus',
  nuevo: 'tabler-plus',
  agregar: 'tabler-plus',
  editar: 'tabler-edit',
  ver: 'tabler-eye',
  detalle: 'tabler-eye',
  detalles: 'tabler-eye',
  eliminar: 'tabler-trash',
  buscar: 'tabler-search',
  busquedas: 'tabler-search',
  coincidencias: 'tabler-target',
  matches: 'tabler-target',

  // Generic
  lista: 'tabler-list',
  listado: 'tabler-list',
  formulario: 'tabler-forms',
  perfil: 'tabler-user-circle',
  configuracion: 'tabler-settings',
  configuraciones: 'tabler-settings',
  ajustes: 'tabler-settings'
}

/**
 * Checks if a string represents a numeric ID
 */
const isNumericId = (segment: string): boolean => {
  return /^\d+$/.test(segment)
}

/**
 * Checks if a string represents a UUID
 */
const isUUID = (segment: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  return uuidRegex.test(segment)
}

/**
 * Gets the appropriate label for a route segment
 */
const getSegmentLabel = (segment: string, index: number, segments: string[]): string => {
  const lowerSegment = segment.toLowerCase()

  // Check if it's a known route label
  if (routeLabels[lowerSegment]) {
    return routeLabels[lowerSegment]
  }

  // Handle IDs (numeric or UUID)
  if (isNumericId(segment) || isUUID(segment)) {
    const prevSegment = segments[index - 1]?.toLowerCase()

    // Contextual ID labeling based on previous segment
    switch (prevSegment) {
      case 'clientes':
        return `Cliente #${segment}`
      case 'franquicias':
        return `Franquicia #${segment}`
      case 'propiedades':
        return `Propiedad #${segment}`
      case 'usuarios':
        return `Usuario #${segment}`
      case 'roles':
        return `Rol #${segment}`
      case 'busquedas':
        return `Búsqueda #${segment}`
      default:
        return `#${segment}`
    }
  }

  // Handle special segments that might contain underscores or hyphens
  const normalizedSegment = segment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return normalizedSegment
}

/**
 * Gets the appropriate icon for a route segment
 */
const getSegmentIcon = (segment: string, index: number, segments: string[]): string | undefined => {
  const lowerSegment = segment.toLowerCase()

  // Check if it's a known route icon
  if (routeIcons[lowerSegment]) {
    return routeIcons[lowerSegment]
  }

  // Handle IDs - use parent segment icon
  if (isNumericId(segment) || isUUID(segment)) {
    const prevSegment = segments[index - 1]?.toLowerCase()

    if (prevSegment && routeIcons[prevSegment]) {
      return routeIcons[prevSegment]
    }
  }

  return undefined
}

/**
 * Builds the href for a breadcrumb item based on the segments up to a certain index
 */
const buildHref = (segments: string[], upToIndex: number): string => {
  const pathSegments = segments.slice(0, upToIndex + 1)

  return '/' + pathSegments.join('/')
}

/**
 * Determines if a breadcrumb item should be clickable
 */
const isClickable = (segment: string, index: number, segments: string[], isLast: boolean): boolean => {
  // Last item is never clickable (current page)
  if (isLast) {
    return false
  }

  // Don't make IDs clickable unless they lead to a view page
  if (isNumericId(segment) || isUUID(segment)) {
    // Check if next segment is a view action
    const nextSegment = segments[index + 1]?.toLowerCase()

    return nextSegment === 'ver' || nextSegment === 'detalle' || nextSegment === 'detalles'
  }

  // Make main sections clickable
  const mainSections = ['busquedas', 'clientes', 'franquicias', 'propiedades', 'usuarios', 'roles', 'home', 'about']

  return mainSections.includes(segment.toLowerCase())
}

/**
 * Adds context-specific badges to breadcrumb items
 */
const getBadge = (segment: string, index: number, segments: string[]): string | undefined => {
  const lowerSegment = segment.toLowerCase()

  // Add "Nuevo" badge for create actions
  if (['crear', 'nuevo', 'agregar'].includes(lowerSegment)) {
    return 'Nuevo'
  }

  // Add "Edit" badge for edit actions
  if (lowerSegment === 'editar') {
    return 'Editar'
  }

  // Add "Ver" badge for view actions
  if (['ver', 'detalle', 'detalles'].includes(lowerSegment)) {
    return 'Ver'
  }

  return undefined
}

/**
 * Main function to generate breadcrumb items from a pathname
 */
export const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  // Remove leading slash and split into segments
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean)

  // Handle empty pathname (home page)
  if (segments.length === 0 || segments[0] === 'home') {
    return [{ label: 'Inicio', href: '/home', icon: 'tabler-home' }]
  }

  // Handle home page

  // Generate breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = segments.map((segment, index) => {
    const isLast = index === segments.length - 1
    const label = getSegmentLabel(segment, index, segments)
    const icon = getSegmentIcon(segment, index, segments)
    const href = isClickable(segment, index, segments, isLast) ? buildHref(segments, index) : undefined
    const badge = getBadge(segment, index, segments)

    return {
      label,
      href,
      icon,
      badge
    }
  })

  return breadcrumbItems
}

/**
 * Helper function to create custom breadcrumb items
 */
export const createBreadcrumbItem = (
  label: string,
  href?: string,
  icon?: string,
  badge?: string
): BreadcrumbItem => ({
  label,
  href,
  icon,
  badge
})

/**
 * Helper function to create breadcrumb items for common patterns
 */
export const createCommonBreadcrumbs = {
  home: () => createBreadcrumbItem('Inicio', '/home', 'tabler-home'),

  clients: () => createBreadcrumbItem('Clientes', '/clientes', 'tabler-users'),
  clientDetail: (id: string) => createBreadcrumbItem(`Cliente #${id}`, undefined, 'tabler-user'),
  clientEdit: (id: string) => createBreadcrumbItem('Editar', undefined, 'tabler-edit', 'Editar'),
  clientNew: () => createBreadcrumbItem('Nuevo Cliente', undefined, 'tabler-plus', 'Nuevo'),

  franchises: () => createBreadcrumbItem('Franquicias', '/franquicias', 'tabler-building-store'),
  franchiseDetail: (id: string) => createBreadcrumbItem(`Franquicia #${id}`, undefined, 'tabler-building-store'),
  franchiseEdit: (id: string) => createBreadcrumbItem('Editar', undefined, 'tabler-edit', 'Editar'),
  franchiseView: (id: string) => createBreadcrumbItem('Ver', undefined, 'tabler-eye', 'Ver'),

  properties: () => createBreadcrumbItem('Propiedades', '/propiedades', 'tabler-home-2'),
  propertyDetail: (id: string) => createBreadcrumbItem(`Propiedad #${id}`, undefined, 'tabler-home-2'),
  propertyEdit: (id: string) => createBreadcrumbItem('Editar', undefined, 'tabler-edit', 'Editar'),
  propertyNew: () => createBreadcrumbItem('Nueva Propiedad', undefined, 'tabler-plus', 'Nuevo'),

  users: () => createBreadcrumbItem('Usuarios', '/usuarios', 'tabler-user'),
  userDetail: (id: string) => createBreadcrumbItem(`Usuario #${id}`, undefined, 'tabler-user'),
  userEdit: (id: string) => createBreadcrumbItem('Editar', undefined, 'tabler-edit', 'Editar'),
  userView: (id: string) => createBreadcrumbItem('Ver', undefined, 'tabler-eye', 'Ver'),

  roles: () => createBreadcrumbItem('Roles', '/roles', 'tabler-user'),
  roleDetail: (id: string) => createBreadcrumbItem(`Rol #${id}`, undefined, 'tabler-user'),
  roleEdit: (id: string) => createBreadcrumbItem('Editar', undefined, 'tabler-edit', 'Editar'),
  roleView: (id: string) => createBreadcrumbItem('Ver', undefined, 'tabler-eye', 'Ver'),

  searches: () => createBreadcrumbItem('Búsquedas', '/busquedas', 'tabler-search'),
  searchDetail: (id: string) => createBreadcrumbItem(`Búsqueda #${id}`, undefined, 'tabler-search'),
  matches: () => createBreadcrumbItem('Coincidencias', undefined, 'tabler-target')
}
