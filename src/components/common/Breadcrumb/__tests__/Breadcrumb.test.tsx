// React Testing Library Imports
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Next.js mocks
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

// Component Imports
import Breadcrumb from '../Breadcrumb'
import { getBreadcrumbItems, createBreadcrumbItem } from '../utils'

// Mock usePathname
import { usePathname } from 'next/navigation'

const mockUsePathname = usePathname as any

describe('Breadcrumb Component', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/home')
  })

  it('renders breadcrumb for home page', () => {
    render(<Breadcrumb />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
  })

  it('renders breadcrumb with custom items', () => {
    const customItems = [
      createBreadcrumbItem('Custom Home', '/'),
      createBreadcrumbItem('Custom Page', '/custom')
    ]

    render(<Breadcrumb customItems={customItems} />)

    expect(screen.getByText('Custom Home')).toBeInTheDocument()
    expect(screen.getByText('Custom Page')).toBeInTheDocument()
  })

  it('does not render home when showHome is false', () => {
    const customItems = [
      createBreadcrumbItem('Page 1', '/page1'),
      createBreadcrumbItem('Page 2', '/page2')
    ]

    render(<Breadcrumb customItems={customItems} showHome={false} />)

    expect(screen.queryByText('Inicio')).not.toBeInTheDocument()
    expect(screen.getByText('Page 1')).toBeInTheDocument()
  })

  it('renders badges correctly', () => {
    const customItems = [
      createBreadcrumbItem('Home', '/', 'tabler-home'),
      createBreadcrumbItem('Edit', undefined, 'tabler-edit', 'Editar')
    ]

    render(<Breadcrumb customItems={customItems} />)

    expect(screen.getByText('Editar')).toBeInTheDocument()
  })
})

describe('getBreadcrumbItems utility', () => {
  it('generates correct breadcrumbs for client route', () => {
    const items = getBreadcrumbItems('/clientes/123/editar')

    expect(items).toHaveLength(3)
    expect(items[0].label).toBe('Clientes')
    expect(items[0].href).toBe('/clientes')
    expect(items[1].label).toBe('Cliente #123')
    expect(items[2].label).toBe('Editar')
    expect(items[2].badge).toBe('Editar')
  })

  it('generates correct breadcrumbs for franchise route', () => {
    const items = getBreadcrumbItems('/franquicias/456/ver')

    expect(items).toHaveLength(3)
    expect(items[0].label).toBe('Franquicias')
    expect(items[1].label).toBe('Franquicia #456')
    expect(items[2].label).toBe('Ver')
    expect(items[2].badge).toBe('Ver')
  })

  it('generates correct breadcrumbs for property route', () => {
    const items = getBreadcrumbItems('/propiedades/789')

    expect(items).toHaveLength(2)
    expect(items[0].label).toBe('Propiedades')
    expect(items[0].href).toBe('/propiedades')
    expect(items[1].label).toBe('Propiedad #789')
  })

  it('handles empty pathname', () => {
    const items = getBreadcrumbItems('')

    expect(items).toHaveLength(1)
    expect(items[0].label).toBe('Inicio')
    expect(items[0].href).toBe('/home')
  })

  it('handles complex route with searches', () => {
    const items = getBreadcrumbItems('/clientes/123/coincidencias')

    expect(items).toHaveLength(3)
    expect(items[0].label).toBe('Clientes')
    expect(items[1].label).toBe('Cliente #123')
    expect(items[2].label).toBe('Coincidencias')
  })

  it('handles UUID identifiers', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000'
    const items = getBreadcrumbItems(`/usuarios/${uuid}/editar`)

    expect(items).toHaveLength(3)
    expect(items[0].label).toBe('Usuarios')
    expect(items[1].label).toBe(`Usuario #${uuid}`)
    expect(items[2].label).toBe('Editar')
  })
})
