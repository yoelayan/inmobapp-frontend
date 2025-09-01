import { TestDataFactory } from '../utils/test-utils'

// Mock Users Repository
export const mockUsersRepository = {
  get: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getUsersByFranchise: jest.fn(),
}

// Mock Franchises Repository
export const mockFranchisesRepository = {
  get: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

// Mock Clients Repository
export const mockClientsRepository = {
  get: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

// Setup default mock implementations
export const setupRepositoryMocks = () => {
  // Users Repository Mocks
  mockUsersRepository.get.mockResolvedValue(TestDataFactory.user())
  mockUsersRepository.getAll.mockResolvedValue(
    TestDataFactory.tableData([TestDataFactory.user(), TestDataFactory.user({ id: 2, name: 'User 2' })])
  )
  mockUsersRepository.create.mockResolvedValue(TestDataFactory.user({ id: 3, name: 'New User' }))
  mockUsersRepository.update.mockResolvedValue(TestDataFactory.user({ id: 1, name: 'Updated User' }))
  mockUsersRepository.delete.mockResolvedValue(true)
  mockUsersRepository.getUsersByFranchise.mockResolvedValue([
    TestDataFactory.user(),
    TestDataFactory.user({ id: 2, name: 'User 2' }),
  ])

  // Franchises Repository Mocks
  mockFranchisesRepository.get.mockResolvedValue(TestDataFactory.franchise())
  mockFranchisesRepository.getAll.mockResolvedValue(
    TestDataFactory.tableData([
      TestDataFactory.franchise(),
      TestDataFactory.franchise({ id: 2, name: 'Franchise 2' }),
    ])
  )
  mockFranchisesRepository.create.mockResolvedValue(TestDataFactory.franchise({ id: 3, name: 'New Franchise' }))
  mockFranchisesRepository.update.mockResolvedValue(TestDataFactory.franchise({ id: 1, name: 'Updated Franchise' }))
  mockFranchisesRepository.delete.mockResolvedValue(true)

  // Clients Repository Mocks
  mockClientsRepository.get.mockResolvedValue(TestDataFactory.client())
  mockClientsRepository.getAll.mockResolvedValue(
    TestDataFactory.tableData([TestDataFactory.client(), TestDataFactory.client({ id: 2, name: 'Client 2' })])
  )
  mockClientsRepository.create.mockResolvedValue(TestDataFactory.client({ id: 3, name: 'New Client' }))
  mockClientsRepository.update.mockResolvedValue(TestDataFactory.client({ id: 1, name: 'Updated Client' }))
  mockClientsRepository.delete.mockResolvedValue(true)
}

// Reset all mocks
export const resetRepositoryMocks = () => {
  mockUsersRepository.get.mockReset()
  mockUsersRepository.getAll.mockReset()
  mockUsersRepository.create.mockReset()
  mockUsersRepository.update.mockReset()
  mockUsersRepository.delete.mockReset()
  mockUsersRepository.getUsersByFranchise.mockReset()

  mockFranchisesRepository.get.mockReset()
  mockFranchisesRepository.getAll.mockReset()
  mockFranchisesRepository.create.mockReset()
  mockFranchisesRepository.update.mockReset()
  mockFranchisesRepository.delete.mockReset()

  mockClientsRepository.get.mockReset()
  mockClientsRepository.getAll.mockReset()
  mockClientsRepository.create.mockReset()
  mockClientsRepository.update.mockReset()
  mockClientsRepository.delete.mockReset()
}

// Mock specific repository modules automatically
jest.mock('@/services/repositories/users/UsersRepository', () => ({
  __esModule: true,
  default: mockUsersRepository,
}))

jest.mock('@/services/repositories/realstate/FranchisesRepository', () => ({
  __esModule: true,
  default: mockFranchisesRepository,
}))

jest.mock('@/services/repositories/crm/ClientsRepository', () => ({
  __esModule: true,
  default: mockClientsRepository,
}))



const mockRepositories = {
  users: mockUsersRepository,
  franchises: mockFranchisesRepository,
  clients: mockClientsRepository,
  setup: setupRepositoryMocks,
  reset: resetRepositoryMocks
}

export default mockRepositories

