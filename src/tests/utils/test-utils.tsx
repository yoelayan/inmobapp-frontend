import React, { type ReactElement, type PropsWithChildren } from 'react'

import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Create a simple theme mock that doesn't require actual MUI
const mockTheme = {
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: '#2196f3' },
    success: { main: '#4caf50' },
    text: {
      primary: '#000000',
      secondary: '#666666'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif'
  },
  spacing: (value: number) => `${8 * value}px`,
  breakpoints: {
    up: () => '@media (min-width: 0px)',
    down: () => '@media (max-width: 9999px)'
  }
}

// Simple ThemeProvider mock that just passes children through
const MockThemeProvider = ({ children }: PropsWithChildren) => {
  return <div data-theme-provider='true'>{children}</div>
}

// Mock AuthProvider for testing
const MockAuthProvider = ({ children }: PropsWithChildren) => {
  return <div data-auth-provider='true'>{children}</div>
}

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {

  /**
   * Optional initial state for providers
   */
  initialState?: any

  /**
   * Optional theme override
   */
  customTheme?: any
}

const AllTheProviders = ({ children,}: PropsWithChildren<{ customTheme?: any }>) => {
  return (
    <MockAuthProvider>
      <MockThemeProvider>{children}</MockThemeProvider>
    </MockAuthProvider>
  )
}

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { customTheme, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders customTheme={customTheme}>{children}</AllTheProviders>,
    ...renderOptions
  })
}

// Re-export everything from React Testing Library


// Export our custom render
export { customRender as render }

// Export userEvent for convenience
export { userEvent }

// Export theme
export { mockTheme as theme }

// Common test utilities
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Mock navigation utilities
export const mockNavigation = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn()
}

export const mockParams = {
  id: '1'
}

export const mockSearchParams = new URLSearchParams()

// Mock router
export const mockRouter = {
  ...mockNavigation,
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  pop: jest.fn(),
  reload: jest.fn(),
  beforePopState: jest.fn()
}

// Helper to create mock component with testid
export const createMockComponent = (name: string) => {
  const MockComponent = ({ children, ...props }: PropsWithChildren<any>) => (
    <div data-testid={`mock-${name.toLowerCase()}`} {...props}>
      {children}
    </div>
  )

  MockComponent.displayName = `Mock${name}`

  return MockComponent
}

// Helper to create mock hook
export const createMockHook = (defaultValue: any) => {
  return jest.fn(() => defaultValue)
}

// Helper to create mock API response
export const createMockApiResponse = (data: any, loading = false, error = null) => ({
  data,
  loading,
  error,
  fetchData: jest.fn(),
  refreshData: jest.fn(),
  getData: jest.fn()
})

// Helper to create mock table data
export const createMockTableData = (items: any[], total = items.length) => ({
  results: items,
  count: total,
  next: null,
  previous: null
})

// Helper to create mock form data
export const createMockFormData = (overrides: Record<string, any> = {}) => ({
  name: 'Test Name',
  email: 'test@example.com',
  is_active: true,
  ...overrides
})

// Modern user event helpers
export const userEventActions = {
  // More realistic user interactions
  type: async (element: Element, text: string) => {
    const user = userEvent.setup()

    await user.type(element, text)
  },

  click: async (element: Element) => {
    const user = userEvent.setup()

    await user.click(element)
  },

  selectOptions: async (element: Element, values: string | string[]) => {
    const user = userEvent.setup()

    await user.selectOptions(element, values)
  },

  clear: async (element: Element) => {
    const user = userEvent.setup()

    await user.clear(element)
  },

  tab: async () => {
    const user = userEvent.setup()

    await user.tab()
  },

  keyboard: async (keys: string) => {
    const user = userEvent.setup()

    await user.keyboard(keys)
  }
}

// Helper to wait for element to appear
export const waitForElement = async (selector: string) => {
  return new Promise<Element | null>(resolve => {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector)

      if (element) {
        observer.disconnect()
        resolve(element)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Timeout after 5 seconds
    setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, 5000)
  })
}

// Helper to mock async operations
export const mockAsyncOperation = (data: any, delay = 100) => {
  return jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(data), delay)))
}

// Helper to mock error operations
export const mockErrorOperation = (error: any = new Error('Test error'), delay = 100) => {
  return jest.fn().mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(error), delay)))
}

// Helper to create mock user data
export const createMockUser = (overrides: Record<string, any> = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  is_active: true,
  is_staff: false,
  is_superuser: false,
  groups: [],
  group_names: [],
  date_joined: '2023-01-01T00:00:00Z',
  last_login: '2023-01-01T00:00:00Z',
  ...overrides
})

// Helper to create mock franchise data
export const createMockFranchise = (overrides: Record<string, any> = {}) => ({
  id: 1,
  identifier: 'TEST-001',
  name: 'Test Franchise',
  franchise_type: 'COMMERCIAL' as const,
  is_active: true,
  parent: null,
  parent_name: null,
  children: [],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides
})

// Helper to create mock client data
export const createMockClient = (overrides: Record<string, any> = {}) => ({
  id: 1,
  name: 'Test Client',
  email: 'client@example.com',
  status_name: 'Active',
  franchise_name: 'Test Franchise',
  assigned_to_name: 'Test User',
  formated_created_at: '2023-01-01',
  ...overrides
})

// Test data factories
export const TestDataFactory = {
  user: createMockUser,
  franchise: createMockFranchise,
  client: createMockClient,
  tableData: createMockTableData,
  formData: createMockFormData,
  apiResponse: createMockApiResponse
}

// Modern setup for MSW integration
export const setupMockServer = () => {
  // This is a placeholder for MSW setup
  // In a real implementation, you would set up MSW here
  console.log('MSW setup would go here for integration testing')
}

// Custom matchers for better assertions
export const customMatchers = {
  toBeVisible: (element: Element) => ({
    pass: element && getComputedStyle(element).visibility !== 'hidden',
    message: () => 'Expected element to be visible'
  }),

  toHaveAccessibleName: (element: Element, name: string) => ({
    pass: element.getAttribute('aria-label') === name || element.textContent === name,
    message: () => `Expected element to have accessible name "${name}"`
  })
}

// Test environment helpers
export const testUtils = {
  // Suppress console errors for specific tests
  suppressConsoleError: (callback: () => void) => {
    const originalError = console.error

    console.error = jest.fn()

    try {
      callback()
    } finally {
      console.error = originalError
    }
  },

  // Wait for all timers to complete
  flushPromises: () => new Promise(resolve => setImmediate(resolve)),

  // Clear all mocks and timers
  cleanup: () => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  }
}
