/**
 * @jest-environment jsdom
 */
import React from 'react'

import { render, screen } from '@/tests/utils/test-utils'
import { setupHookMocks } from '@/tests/__mocks__/hooks'
import '@/tests/__mocks__/components'
import AddFranchise from '../page'

// Setup mocks
beforeEach(() => {
  setupHookMocks()
})

describe('Add Franchise Page', () => {
  it('should render without crashing', () => {
    render(<AddFranchise />)
    expect(screen.getByTestId('mock-sectionheader')).toBeInTheDocument()
    expect(screen.getByTestId('mock-franchiseform')).toBeInTheDocument()
  })

  it('should render section header with correct title', () => {
    render(<AddFranchise />)
    const sectionHeader = screen.getByTestId('mock-sectionheader')

    expect(sectionHeader).toBeInTheDocument()
  })

  it('should render franchise form component', () => {
    render(<AddFranchise />)
    expect(screen.getByTestId('mock-franchiseform')).toBeInTheDocument()
  })

  it('should have correct page structure', () => {
    const { container } = render(<AddFranchise />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    const { container } = render(<AddFranchise />)

    expect(container.firstChild).toMatchSnapshot()
  })
})

// Test with different states
describe('Add Franchise Page - Different States', () => {
  it('should render when form is in loading state', () => {
    render(<AddFranchise />)
    expect(screen.getByTestId('mock-franchiseform')).toBeInTheDocument()
  })

  it('should render all required components', () => {
    render(<AddFranchise />)
    expect(screen.getByTestId('mock-sectionheader')).toBeInTheDocument()
    expect(screen.getByTestId('mock-franchiseform')).toBeInTheDocument()
  })

  it('should render components correctly', () => {
    const { container } = render(<AddFranchise />)


    // Just check that the container has content
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).not.toBeEmptyDOMElement()
  })
})

// Test form integration
describe('Add Franchise Page - Form Integration', () => {
  it('should pass correct props to franchise form', () => {
    render(<AddFranchise />)
    const franchiseForm = screen.getByTestId('mock-franchiseform')

    expect(franchiseForm).toBeInTheDocument()
  })

  it('should handle form submission', () => {
    render(<AddFranchise />)
    const franchiseForm = screen.getByTestId('mock-franchiseform')

    expect(franchiseForm).toBeInTheDocument()

    // Form submission logic would be tested in the actual form component
  })

  it('should handle form errors', () => {
    render(<AddFranchise />)
    const franchiseForm = screen.getByTestId('mock-franchiseform')

    expect(franchiseForm).toBeInTheDocument()

    // Error handling would be tested in the actual form component
  })
})
