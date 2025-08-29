import React from 'react'

import { createMockComponent } from '../utils/test-utils'

// Mock useAuth hook
const mockUseAuth = jest.fn(() => ({
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    user_permissions: ['add_franchise', 'view_franchise', 'change_franchise', 'delete_franchise']
  },
  isAuthenticated: true,
  loading: false,
  session: { access: 'mock-token', refresh: 'mock-refresh' },
  login: jest.fn(),
  logout: jest.fn()
}))

// Mock AuthProvider
const MockAuthProvider = ({ children }: any) => (
  <div data-testid="mock-auth-provider">{children}</div>
)

// Mock PermissionGuard
const MockPermissionGuard = ({ children }: any) => (
  <div data-testid="mock-permission-guard">{children}</div>
)

// Mock BreadcrumbWrapper
const MockBreadcrumbWrapper = (props: any) => (
  <div data-testid="mock-breadcrumb-wrapper" {...props} />
)

// Mock GenericTable Component
export const MockGenericTable = createMockComponent('GenericTable')

// Mock UserForm Component
export const MockUserForm = createMockComponent('UserForm')

// Mock FranchiseForm Component
export const MockFranchiseForm = createMockComponent('FranchiseForm')

// Mock ClientForm Component
export const MockClientForm = createMockComponent('ClientForm')

// Mock SectionHeader Component
export const MockSectionHeader = createMockComponent('SectionHeader')

// Mock Material-UI Components
export const MockCircularProgress = createMockComponent('CircularProgress')
export const MockCard = createMockComponent('Card')
export const MockCardHeader = createMockComponent('CardHeader')
export const MockCardContent = createMockComponent('CardContent')
export const MockBox = createMockComponent('Box')
export const MockTypography = createMockComponent('Typography')
export const MockButton = createMockComponent('Button')
export const MockAvatar = createMockComponent('Avatar')
export const MockGrid = createMockComponent('Grid')
export const MockGrid2 = createMockComponent('Grid2')

// Custom mock for Chip component to handle label correctly
export const MockChip = ({ label, ...props }: any) => (
  <div data-testid="mock-chip" aria-label={label} {...props}>
    {label}
  </div>
)

// Mock specific component modules
jest.mock('@/pages/shared/list/GenericTable', () => ({
  __esModule: true,
  default: MockGenericTable,
}))

jest.mock('@/pages/apps/users/form/UserForm', () => ({
  __esModule: true,
  UserForm: MockUserForm,
}))

jest.mock('@/pages/apps/franchises/form/FranchiseForm', () => ({
  __esModule: true,
  default: MockFranchiseForm,
}))

jest.mock('@/pages/apps/clients/form/ClientForm', () => ({
  __esModule: true,
  ClientForm: MockClientForm,
}))

jest.mock('@/components/layout/horizontal/SectionHeader', () => ({
  __esModule: true,
  default: MockSectionHeader,
}))

// Mock auth-related modules
jest.mock('@auth/hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}))

jest.mock('@auth/context/AuthContext', () => ({
  AuthProvider: MockAuthProvider,
  useAuthContext: mockUseAuth,
}))

jest.mock('@auth/hocs/PermissionGuard', () => ({
  __esModule: true,
  default: MockPermissionGuard,
}))

jest.mock('@components/common/Breadcrumb', () => ({
  BreadcrumbWrapper: MockBreadcrumbWrapper,
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => '/test-path'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// Mock ALL Material-UI components used in the project
jest.mock('@mui/material', () => ({
  Card: MockCard,
  CardHeader: MockCardHeader,
  CardContent: MockCardContent,
  Box: MockBox,
  Typography: MockTypography,
  Button: MockButton,
  CircularProgress: MockCircularProgress,
  Avatar: MockAvatar,
  Chip: MockChip,
  Grid2: MockGrid2,
  Grid: MockGrid,

  // Add any other MUI components that might be used
  TextField: createMockComponent('TextField'),
  FormControl: createMockComponent('FormControl'),
  InputLabel: createMockComponent('InputLabel'),
  Select: createMockComponent('Select'),
  MenuItem: createMockComponent('MenuItem'),
  FormHelperText: createMockComponent('FormHelperText'),
  Switch: createMockComponent('Switch'),
  FormControlLabel: createMockComponent('FormControlLabel'),
  Paper: createMockComponent('Paper'),
  Stack: createMockComponent('Stack'),
  Divider: createMockComponent('Divider'),
  List: createMockComponent('List'),
  ListItem: createMockComponent('ListItem'),
  ListItemText: createMockComponent('ListItemText'),
  ListItemIcon: createMockComponent('ListItemIcon'),
  IconButton: createMockComponent('IconButton'),
  AppBar: createMockComponent('AppBar'),
  Toolbar: createMockComponent('Toolbar'),
  Container: createMockComponent('Container'),
  Dialog: createMockComponent('Dialog'),
  DialogTitle: createMockComponent('DialogTitle'),
  DialogContent: createMockComponent('DialogContent'),
  DialogActions: createMockComponent('DialogActions'),
  Snackbar: createMockComponent('Snackbar'),
  Alert: createMockComponent('Alert'),
  Accordion: createMockComponent('Accordion'),
  AccordionSummary: createMockComponent('AccordionSummary'),
  AccordionDetails: createMockComponent('AccordionDetails'),
  Tabs: createMockComponent('Tabs'),
  Tab: createMockComponent('Tab'),
  TabPanel: createMockComponent('TabPanel'),
  Table: createMockComponent('Table'),
  TableBody: createMockComponent('TableBody'),
  TableCell: createMockComponent('TableCell'),
  TableContainer: createMockComponent('TableContainer'),
  TableHead: createMockComponent('TableHead'),
  TableRow: createMockComponent('TableRow'),
  Pagination: createMockComponent('Pagination'),
  Menu: createMockComponent('Menu'),
  Badge: createMockComponent('Badge'),
  Backdrop: createMockComponent('Backdrop'),
  Modal: createMockComponent('Modal'),
  Drawer: createMockComponent('Drawer'),
}))

// Mock Material-UI styles
jest.mock('@mui/material/styles', () => ({
  createTheme: jest.fn(() => ({})),
  ThemeProvider: ({ children }: any) => children,
  useTheme: jest.fn(() => ({})),
  styled: jest.fn(() => () => null),
}))

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => new Proxy({}, {
  get: () => createMockComponent('Icon')
}))

// Mock Material-UI icons individual imports
jest.mock('@mui/icons-material/Edit', () => ({
  __esModule: true,
  default: createMockComponent('EditIcon'),
}))

jest.mock('@mui/icons-material/Delete', () => ({
  __esModule: true,
  default: createMockComponent('DeleteIcon'),
}))

jest.mock('@mui/icons-material/Visibility', () => ({
  __esModule: true,
  default: createMockComponent('VisibilityIcon'),
}))

jest.mock('@mui/icons-material/Group', () => ({
  __esModule: true,
  default: createMockComponent('GroupIcon'),
}))

// Mock UsersTable Component
export const MockUsersTable = ({ title = 'Usuarios', ...props }: any) => (
  <div data-testid="mock-users-table" {...props}>
    <h1>{title}</h1>
    <div data-testid="users-table-content">
      <button>Agregar Usuario</button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test User</td>
            <td>test@example.com</td>
            <td>
              <button>Ver</button>
              <button>Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)

jest.mock('@/pages/apps/users/list/UsersTable', () => ({
  __esModule: true,
  default: MockUsersTable,
}))

// Mock FranchisesTable Component
export const MockFranchisesTable = ({ title = 'Franquicias', ...props }: any) => (
  <div data-testid="mock-franchises-table" {...props}>
    <h1>{title}</h1>
    <div data-testid="franchises-table-content">
      <button>Agregar Franquicia</button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test Franchise</td>
            <td>Commercial</td>
            <td>
              <button>Ver</button>
              <button>Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)

jest.mock('@/pages/apps/franchises/list/FranchisesTable', () => ({
  __esModule: true,
  default: MockFranchisesTable,
}))

export default {
  GenericTable: MockGenericTable,
  UserForm: MockUserForm,
  FranchiseForm: MockFranchiseForm,
  ClientForm: MockClientForm,
  SectionHeader: MockSectionHeader,
  CircularProgress: MockCircularProgress,
  Card: MockCard,
  CardHeader: MockCardHeader,
  CardContent: MockCardContent,
  Box: MockBox,
  Typography: MockTypography,
  Button: MockButton,
  Avatar: MockAvatar,
  Chip: MockChip,
  Grid: MockGrid,
  Grid2: MockGrid2,
  UsersTable: MockUsersTable,
  FranchisesTable: MockFranchisesTable,
  AuthProvider: MockAuthProvider,
  PermissionGuard: MockPermissionGuard,
  BreadcrumbWrapper: MockBreadcrumbWrapper,
  useAuth: mockUseAuth,
}
