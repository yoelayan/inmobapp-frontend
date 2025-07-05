import { TestDataFactory } from '../utils/test-utils'

// Mock hook return values
export const mockHookReturnValue = {
  data: null,
  loading: false,
  error: null,
  errors: null,
  item: null,
  fetchData: jest.fn(),
  refreshData: jest.fn(),
  getData: jest.fn(),
  fetchItemById: jest.fn(),
  createData: jest.fn(),
  updateData: jest.fn(),
  deleteData: jest.fn(),
}

// Mock Users Hook
export const mockUseUsers = jest.fn(() => ({
  ...mockHookReturnValue,
  data: TestDataFactory.tableData([
    TestDataFactory.user(),
    TestDataFactory.user({ id: 2, name: 'User 2' })
  ]),
  getUsersByFranchise: jest.fn(),
  item: TestDataFactory.user(),
}))

// Mock Franchises Hook
export const mockUseFranchises = jest.fn(() => ({
  ...mockHookReturnValue,
  data: TestDataFactory.tableData([
    TestDataFactory.franchise(),
    TestDataFactory.franchise({ id: 2, name: 'Franchise 2' })
  ]),
  item: TestDataFactory.franchise(),
}))

// Mock Clients Hook
export const mockUseClients = jest.fn(() => ({
  ...mockHookReturnValue,
  data: TestDataFactory.tableData([TestDataFactory.client(), TestDataFactory.client({ id: 2, name: 'Client 2' })]),
}))

// Setup hook configurations
export const setupHookMocks = () => {
  // Configure Users Hook
  mockUseUsers.mockReturnValue({
    ...mockHookReturnValue,
    data: TestDataFactory.tableData([
      TestDataFactory.user(),
      TestDataFactory.user({ id: 2, name: 'User 2' })
    ]),
    getUsersByFranchise: jest.fn().mockResolvedValue([
      TestDataFactory.user(),
      TestDataFactory.user({ id: 2, name: 'User 2' })
    ]),
    item: TestDataFactory.user(),
  })

  // Configure Franchises Hook
  mockUseFranchises.mockReturnValue({
    ...mockHookReturnValue,
    data: TestDataFactory.tableData([
      TestDataFactory.franchise(),
      TestDataFactory.franchise({ id: 2, name: 'Franchise 2' })
    ]),
    item: TestDataFactory.franchise(),
  })

  // Configure Clients Hook
  mockUseClients.mockReturnValue({
    ...mockHookReturnValue,
    data: TestDataFactory.tableData([TestDataFactory.client(), TestDataFactory.client({ id: 2, name: 'Client 2' })]),
  })
}

// Setup loading state mocks
export const setupLoadingMocks = () => {
  mockUseUsers.mockReturnValue({
    ...mockHookReturnValue,
    loading: true,
    data: null,
  })

  mockUseFranchises.mockReturnValue({
    ...mockHookReturnValue,
    loading: true,
    data: null,
  })

  mockUseClients.mockReturnValue({
    ...mockHookReturnValue,
    loading: true,
    data: null,
  })
}

// Setup error state mocks
export const setupErrorMocks = () => {
  const errorMessage = 'Test error message'

  mockUseUsers.mockReturnValue({
    ...mockHookReturnValue,
    error: errorMessage,
    data: null,
  })

  mockUseFranchises.mockReturnValue({
    ...mockHookReturnValue,
    error: errorMessage,
    data: null,
  })

  mockUseClients.mockReturnValue({
    ...mockHookReturnValue,
    error: errorMessage,
    data: null,
  })
}

// Reset all hook mocks
export const resetHookMocks = () => {
  mockUseUsers.mockReset()
  mockUseFranchises.mockReset()
  mockUseClients.mockReset()
}

export default {
  users: mockUseUsers,
  franchises: mockUseFranchises,
  clients: mockUseClients,
  setup: setupHookMocks,
  setupLoading: setupLoadingMocks,
  setupError: setupErrorMocks,
  reset: resetHookMocks,
}
