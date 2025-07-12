/**
 * @jest-environment jsdom
 */
import React from 'react'

import { render, screen } from '@/tests/utils/test-utils'
import { setupHookMocks } from '@/tests/__mocks__/hooks'
import '@/tests/__mocks__/components'
import Franchises from '../page'

// Setup mocks
beforeEach(() => {
  setupHookMocks()
})

describe('Franchises Page', () => {
  it('should render without crashing', () => {
    render(<Franchises />)
    expect(screen.getByTestId('mock-franchises-table')).toBeInTheDocument()
  })

  it('should render the franchises table component', () => {
    render(<Franchises />)
    expect(screen.getByTestId('mock-franchises-table')).toBeInTheDocument()
  })

  it('should display the correct title', () => {
    render(<Franchises />)
    expect(screen.getByText('Franquicias')).toBeInTheDocument()
  })

  it('should render table headers correctly', () => {
    render(<Franchises />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Tipo')).toBeInTheDocument()
    expect(screen.getByText('Acciones')).toBeInTheDocument()
  })

  it('should render action buttons', () => {
    render(<Franchises />)
    expect(screen.getByText('Agregar Franquicia')).toBeInTheDocument()
    expect(screen.getByText('Ver')).toBeInTheDocument()
    expect(screen.getByText('Editar')).toBeInTheDocument()
  })

  it('should render test franchise data', () => {
    render(<Franchises />)
    expect(screen.getByText('Test Franchise')).toBeInTheDocument()
    expect(screen.getByText('Commercial')).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    const { container } = render(<Franchises />)

    expect(container.firstChild).toMatchSnapshot()
  })
})

// Test with different franchise data
describe('Franchises Page - Different Data', () => {
  it('should render correctly with mock data', () => {
    render(<Franchises />)
    expect(screen.getByTestId('mock-franchises-table')).toBeInTheDocument()
    expect(screen.getByText('Test Franchise')).toBeInTheDocument()
  })

  it('should render table structure correctly', () => {
    render(<Franchises />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Tipo')).toBeInTheDocument()
    expect(screen.getByText('Acciones')).toBeInTheDocument()
  })

  it('should have correct franchise table content', () => {
    render(<Franchises />)
    const tableContent = screen.getByTestId('franchises-table-content')

    expect(tableContent).toBeInTheDocument()
  })
})
