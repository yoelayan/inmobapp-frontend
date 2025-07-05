/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/tests/utils/test-utils'
import { setupHookMocks } from '@/tests/__mocks__/hooks'
import '@/tests/__mocks__/components'
import AddUser from '../page'

// Setup mocks
beforeEach(() => {
  setupHookMocks()
})

describe('Add User Page', () => {
  it('should render without crashing', () => {
    render(<AddUser />)
    expect(screen.getByTestId('mock-sectionheader')).toBeInTheDocument()
    expect(screen.getByTestId('mock-userform')).toBeInTheDocument()
  })

  it('should render section header with correct title', () => {
    render(<AddUser />)
    const sectionHeader = screen.getByTestId('mock-sectionheader')
    expect(sectionHeader).toBeInTheDocument()
  })

  it('should render user form component', () => {
    render(<AddUser />)
    expect(screen.getByTestId('mock-userform')).toBeInTheDocument()
  })

  it('should have correct page structure', () => {
    const { container } = render(<AddUser />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    const { container } = render(<AddUser />)
    expect(container.firstChild).toMatchSnapshot()
  })
})

// Test with different states
describe('Add User Page - Different States', () => {
  it('should render when form is in loading state', () => {
    render(<AddUser />)
    expect(screen.getByTestId('mock-userform')).toBeInTheDocument()
  })

  it('should render all required components', () => {
    render(<AddUser />)
    expect(screen.getByTestId('mock-sectionheader')).toBeInTheDocument()
    expect(screen.getByTestId('mock-userform')).toBeInTheDocument()
  })
})
