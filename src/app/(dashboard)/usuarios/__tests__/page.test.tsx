/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/tests/utils/test-utils'
import { setupHookMocks } from '@/tests/__mocks__/hooks'
import '@/tests/__mocks__/components'
import Users from '../page'

// Setup mocks
beforeEach(() => {
  setupHookMocks()
})

describe('Users Page', () => {
  it('should render without crashing', () => {
    render(<Users />)
    expect(screen.getByTestId('mock-users-table')).toBeInTheDocument()
  })

  it('should render the users table component', () => {
    render(<Users />)
    expect(screen.getByTestId('mock-users-table')).toBeInTheDocument()
  })

  it('should display the correct title', () => {
    render(<Users />)
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
  })

  it('should render table headers correctly', () => {
    render(<Users />)
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Acciones')).toBeInTheDocument()
  })

  it('should render action buttons', () => {
    render(<Users />)
    expect(screen.getByText('Agregar Usuario')).toBeInTheDocument()
    expect(screen.getByText('Ver')).toBeInTheDocument()
    expect(screen.getByText('Editar')).toBeInTheDocument()
  })

  it('should render test user data', () => {
    render(<Users />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    const { container } = render(<Users />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
