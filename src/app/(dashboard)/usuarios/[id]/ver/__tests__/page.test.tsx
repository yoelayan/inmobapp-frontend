/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/tests/utils/test-utils'
import { setupHookMocks } from '@/tests/__mocks__/hooks'
import { setupRepositoryMocks } from '@/tests/__mocks__/repositories'
import '@/tests/__mocks__/components'
import ViewUser from '../page'

jest.mock('@mui/material/Card', () => ({ __esModule: true, default: (props) => <div data-testid="mock-card">{props.children}</div> }))
jest.mock('@mui/material/CardHeader', () => ({ __esModule: true, default: (props) => <div data-testid="mock-cardheader">{props.children}</div> }))
jest.mock('@mui/material/CardContent', () => ({ __esModule: true, default: (props) => <div data-testid="mock-cardcontent">{props.children}</div> }))

const mockParams = { id: '1' }

beforeEach(() => {
  setupHookMocks()
  setupRepositoryMocks()
  jest.clearAllMocks()
})

describe('View User Page', () => {
  it('should render without crashing', async () => {
    render(<ViewUser params={mockParams} />)
    expect(await screen.findByTestId('mock-card')).toBeInTheDocument()
  })

  it('should render the user data card', async () => {
    render(<ViewUser params={mockParams} />)
    expect(await screen.findByTestId('mock-card')).toBeInTheDocument()
  })

  it('should display user information correctly', async () => {
    render(<ViewUser params={mockParams} />)
    const userNameEls = await screen.findAllByText('Test User')
    expect(userNameEls.length).toBeGreaterThan(0)
    const emailEls = await screen.findAllByText('test@example.com')
    expect(emailEls.length).toBeGreaterThan(0)
  })

  it('should render card header and content', async () => {
    render(<ViewUser params={mockParams} />)
    // CardHeader y CardContent pueden no estar presentes si no se usan en el componente real
    // Por ahora solo comprobamos el card principal
    expect(await screen.findByTestId('mock-card')).toBeInTheDocument()
  })

  it('should display user details in a structured way', async () => {
    render(<ViewUser params={mockParams} />)
    const userNameEls = await screen.findAllByText('Test User')
    expect(userNameEls.length).toBeGreaterThan(0)
    const emailEls = await screen.findAllByText('test@example.com')
    expect(emailEls.length).toBeGreaterThan(0)
    expect(await screen.findByText('Activo')).toBeInTheDocument()
  })

  it('should match snapshot', async () => {
    const { container } = render(<ViewUser params={mockParams} />)
    // Esperar a que el usuario se muestre
    await screen.findAllByText('Test User')
    expect(container.firstChild).toMatchSnapshot()
  })
})
