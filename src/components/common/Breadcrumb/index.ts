// Main components
export { default as Breadcrumb } from './Breadcrumb'
export { default as BreadcrumbWrapper } from './BreadcrumbWrapper'

// Types and utilities
export type { BreadcrumbItem } from './utils'
export {
  getBreadcrumbItems,
  createBreadcrumbItem,
  createCommonBreadcrumbs
} from './utils'

// Re-export the main component as default
export { default } from './Breadcrumb'
