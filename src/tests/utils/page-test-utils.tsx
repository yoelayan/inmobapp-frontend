import React from 'react'
import { render, screen, waitFor } from './test-utils'
import { mockNavigation, mockParams } from './test-utils'
import type { RenderResult } from '@testing-library/react'

// Mock next/navigation for pages
jest.mock('next/navigation', () => ({
  useRouter: () => mockNavigation,
  useParams: () => mockParams,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

/**
 * Interface for page test configuration
 */
interface PageTestConfig {
  /**
   * Page component to test
   */
  component: React.ComponentType<any>
  /**
   * Props to pass to the component
   */
  props?: any
  /**
   * Mock data for hooks
   */
  mockData?: {
    [key: string]: any
  }
  /**
   * Expected elements to be present
   */
  expectedElements?: {
    titles?: string[]
    buttons?: string[]
    inputs?: string[]
    tables?: string[]
    loading?: boolean
    error?: boolean
  }
}

/**
 * Helper class for testing pages with common patterns
 */
export class PageTestHelper {
  private renderResult: RenderResult
  private config: PageTestConfig

  constructor(config: PageTestConfig) {
    this.config = config
    this.renderResult = render(<config.component {...config.props} />)
  }

  /**
   * Test if page renders without crashing
   */
  async testRender() {
    expect(this.renderResult.container).toBeInTheDocument()
    return this
  }

  /**
   * Test if expected titles are present
   */
  async testTitles() {
    const { expectedElements } = this.config
    if (expectedElements?.titles) {
      for (const title of expectedElements.titles) {
        await waitFor(() => {
          expect(screen.getByText(title)).toBeInTheDocument()
        })
      }
    }
    return this
  }

  /**
   * Test if expected buttons are present
   */
  async testButtons() {
    const { expectedElements } = this.config
    if (expectedElements?.buttons) {
      for (const button of expectedElements.buttons) {
        await waitFor(() => {
          expect(screen.getByRole('button', { name: button })).toBeInTheDocument()
        })
      }
    }
    return this
  }

  /**
   * Test if expected inputs are present
   */
  async testInputs() {
    const { expectedElements } = this.config
    if (expectedElements?.inputs) {
      for (const input of expectedElements.inputs) {
        await waitFor(() => {
          expect(screen.getByLabelText(input)).toBeInTheDocument()
        })
      }
    }
    return this
  }

  /**
   * Test if loading state is displayed
   */
  async testLoading() {
    const { expectedElements } = this.config
    if (expectedElements?.loading) {
      await waitFor(() => {
        expect(screen.getByText(/cargando/i)).toBeInTheDocument()
      })
    }
    return this
  }

  /**
   * Test if error state is displayed
   */
  async testError() {
    const { expectedElements } = this.config
    if (expectedElements?.error) {
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    }
    return this
  }

  /**
   * Test if table is present
   */
  async testTable() {
    const { expectedElements } = this.config
    if (expectedElements?.tables) {
      for (const table of expectedElements.tables) {
        await waitFor(() => {
          expect(screen.getByText(table)).toBeInTheDocument()
        })
      }
    }
    return this
  }

  /**
   * Test navigation behavior
   */
  async testNavigation(actionType: 'click' | 'submit', elementName: string, expectedPath: string) {
    const element = screen.getByRole(actionType === 'click' ? 'button' : 'form', { name: elementName })

    if (actionType === 'click') {
      element.click()
    } else {
      element.dispatchEvent(new Event('submit', { bubbles: true }))
    }

    await waitFor(() => {
      expect(mockNavigation.push).toHaveBeenCalledWith(expectedPath)
    })

    return this
  }

  /**
   * Run all configured tests
   */
  async runAllTests() {
    await this.testRender()
    await this.testTitles()
    await this.testButtons()
    await this.testInputs()
    await this.testLoading()
    await this.testError()
    await this.testTable()
    return this
  }

  /**
   * Get the render result for custom testing
   */
  getRenderResult() {
    return this.renderResult
  }
}

/**
 * Helper function to create a page test suite
 */
export const createPageTestSuite = (suiteName: string, config: PageTestConfig) => {
  describe(suiteName, () => {
    let pageHelper: PageTestHelper

    beforeEach(() => {
      pageHelper = new PageTestHelper(config)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should render without crashing', async () => {
      await pageHelper.testRender()
    })

    if (config.expectedElements?.titles) {
      it('should display expected titles', async () => {
        await pageHelper.testTitles()
      })
    }

    if (config.expectedElements?.buttons) {
      it('should display expected buttons', async () => {
        await pageHelper.testButtons()
      })
    }

    if (config.expectedElements?.inputs) {
      it('should display expected inputs', async () => {
        await pageHelper.testInputs()
      })
    }

    if (config.expectedElements?.loading) {
      it('should display loading state', async () => {
        await pageHelper.testLoading()
      })
    }

    if (config.expectedElements?.error) {
      it('should display error state', async () => {
        await pageHelper.testError()
      })
    }

    if (config.expectedElements?.tables) {
      it('should display expected tables', async () => {
        await pageHelper.testTable()
      })
    }
  })
}

/**
 * Helper function to test list pages
 */
export const testListPage = (
  pageName: string,
  PageComponent: React.ComponentType<any>,
  expectedConfig: {
    title: string
    subtitle?: string
    addButton?: string
    tableHeaders?: string[]
    mockData?: any[]
  }
) => {
  return createPageTestSuite(`${pageName} List Page`, {
    component: PageComponent,
    expectedElements: {
      titles: [expectedConfig.title, expectedConfig.subtitle].filter(Boolean) as string[],
      buttons: expectedConfig.addButton ? [expectedConfig.addButton] : [],
      tables: expectedConfig.tableHeaders || [],
    },
  })
}

/**
 * Helper function to test form pages
 */
export const testFormPage = (
  pageName: string,
  PageComponent: React.ComponentType<any>,
  expectedConfig: {
    title: string
    subtitle?: string
    submitButton?: string
    cancelButton?: string
    inputs?: string[]
  }
) => {
  return createPageTestSuite(`${pageName} Form Page`, {
    component: PageComponent,
    expectedElements: {
      titles: [expectedConfig.title, expectedConfig.subtitle].filter(Boolean) as string[],
      buttons: [expectedConfig.submitButton, expectedConfig.cancelButton].filter(Boolean) as string[],
      inputs: expectedConfig.inputs || [],
    },
  })
}

/**
 * Helper function to test view pages
 */
export const testViewPage = (
  pageName: string,
  PageComponent: React.ComponentType<any>,
  expectedConfig: {
    title: string
    subtitle?: string
    editButton?: string
    backButton?: string
    fields?: string[]
  }
) => {
  return createPageTestSuite(`${pageName} View Page`, {
    component: PageComponent,
    expectedElements: {
      titles: [expectedConfig.title, expectedConfig.subtitle].filter(Boolean) as string[],
      buttons: [expectedConfig.editButton, expectedConfig.backButton].filter(Boolean) as string[],
    },
  })
}

/**
 * Create common test patterns for CRUD pages
 */
export const createCrudTestSuite = (
  entityName: string,
  pages: {
    list?: React.ComponentType<any>
    add?: React.ComponentType<any>
    edit?: React.ComponentType<any>
    view?: React.ComponentType<any>
  },
  config: {
    listTitle?: string
    addTitle?: string
    editTitle?: string
    viewTitle?: string
    tableHeaders?: string[]
    formInputs?: string[]
    viewFields?: string[]
  }
) => {
  describe(`${entityName} CRUD Pages`, () => {
    if (pages.list && config.listTitle) {
      testListPage(`${entityName} List`, pages.list, {
        title: config.listTitle,
        tableHeaders: config.tableHeaders,
      })
    }

    if (pages.add && config.addTitle) {
      testFormPage(`${entityName} Add`, pages.add, {
        title: config.addTitle,
        inputs: config.formInputs,
      })
    }

    if (pages.edit && config.editTitle) {
      testFormPage(`${entityName} Edit`, pages.edit, {
        title: config.editTitle,
        inputs: config.formInputs,
      })
    }

    if (pages.view && config.viewTitle) {
      testViewPage(`${entityName} View`, pages.view, {
        title: config.viewTitle,
        fields: config.viewFields,
      })
    }
  })
}

export default PageTestHelper
