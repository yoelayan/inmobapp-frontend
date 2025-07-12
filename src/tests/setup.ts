import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'util'

import { configure } from '@testing-library/react'

// Configure testing library with modern best practices
configure({
  testIdAttribute: 'data-testid',

  // Reduce timeout for better performance
  asyncUtilTimeout: 2000,

  // Show suggestions for better queries
  getElementError: (message, container) => {
    const prettierMessage = message + '\n\nTip: Use screen.debug() to see the current DOM structure.'

    
return new Error(prettierMessage)
  },
})

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any

// Mock console methods in a more controlled way
const originalError = console.error
const originalWarn = console.warn

beforeEach(() => {
  // Only suppress specific React warnings in tests
  jest.spyOn(console, 'error').mockImplementation((message) => {
    if (
      typeof message === 'string' &&
      (message.includes('Warning: ReactDOM.render') ||
       message.includes('Warning: componentWillReceiveProps') ||
       message.includes('Warning: componentWillMount') ||
       message.includes('Warning: React does not recognize') ||
       message.includes('Warning: Received'))
    ) {
      return
    }

    originalError(message)
  })

  jest.spyOn(console, 'warn').mockImplementation((message) => {
    if (
      typeof message === 'string' &&
      message.includes('Warning:')
    ) {
      return
    }

    originalWarn(message)
  })
})

afterEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

// Modern window.matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.location with modern API
delete (window as any).location
window.location = {
  href: 'http://localhost:3000',
  hostname: 'localhost',
  port: '3000',
  protocol: 'http:',
  host: 'localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  toString: jest.fn(() => 'http://localhost:3000'),
} as any

// Mock next/router with proper TypeScript types
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    pop: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: true,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
  })),
}))

// Mock next/navigation for App Router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  })),
  useParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useSelectedLayoutSegment: jest.fn(() => null),
  useSelectedLayoutSegments: jest.fn(() => []),
  notFound: jest.fn(),
  redirect: jest.fn(),
  permanentRedirect: jest.fn(),
}))

// Simple Observer APIs
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

// Mock global MutationObserver compatible con Testing Library
class MockMutationObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
  constructor(callback: any) {}
}

Object.defineProperty(global, 'MutationObserver', {
  writable: true,
  configurable: true,
  value: MockMutationObserver,
});

// Mock fetch with better error handling
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    headers: new Headers(),
    redirected: false,
    type: 'basic',
    url: '',
    clone: jest.fn(),
  } as Response)
)

// Enhanced HTMLElement methods
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
})

Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})

Object.defineProperty(HTMLElement.prototype, 'scroll', {
  value: jest.fn(),
  writable: true,
})

// Modern storage mocks with complete API
const createStorageMock = () => {
  let store: Record<string, string> = {}

  
return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = String(value)
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  }
}

Object.defineProperty(window, 'localStorage', {
  value: createStorageMock(),
  writable: true,
})

Object.defineProperty(window, 'sessionStorage', {
  value: createStorageMock(),
  writable: true,
})

// Modern crypto API mock
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => '12345678-1234-1234-1234-123456789012'),
    getRandomValues: jest.fn((array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }

      
return array
    }),
    subtle: {
      digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
    },
  },
})

// Enhanced Image mock
class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src: string = ''

  constructor() {
    // Immediate execution to avoid delays
    setTimeout(() => {
      if (this.onload) {
        this.onload()
      }
    }, 0)
  }
}

Object.defineProperty(global, 'Image', {
  value: MockImage,
})

// Canvas context mock
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Uint8ClampedArray() })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Uint8ClampedArray() })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}))

// Simple animation frame mocks
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0))
global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id))

// requestIdleCallback mock
global.requestIdleCallback = jest.fn((cb) => setTimeout(cb, 0))
global.cancelIdleCallback = jest.fn((id) => clearTimeout(id))

// Environment setup
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'

// URL and URLSearchParams are available in Node 18+, but let's ensure they're properly set
if (!global.URL) {
  const { URL, URLSearchParams } = require('url')

  global.URL = URL
  global.URLSearchParams = URLSearchParams
}
