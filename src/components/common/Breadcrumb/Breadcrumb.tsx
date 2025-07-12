'use client'

// React Imports
import React from 'react'

// Next Imports
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Component Imports
import { getBreadcrumbItems, type BreadcrumbItem } from './utils'

interface BreadcrumbProps {

  /**
   * Override the auto-generated breadcrumb items
   */
  customItems?: BreadcrumbItem[]

  /**
   * Show home icon at the beginning
   */
  showHome?: boolean

  /**
   * Maximum number of breadcrumb items to show
   */
  maxItems?: number

  /**
   * Additional class names
   */
  className?: string

  /**
   * Separator between breadcrumb items
   */
  separator?: React.ReactNode

  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large'
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  customItems,
  showHome = true,
  maxItems = 8,
  className = '',
  separator = '/',
  size = 'medium'
}) => {
  const pathname = usePathname()

  // Get breadcrumb items from pathname or use custom items
  const breadcrumbItems = customItems || getBreadcrumbItems(pathname || '')

  // Filter out empty items and apply maxItems limit
  const filteredItems = breadcrumbItems
    .filter(item => item.label && item.label.trim() !== '')
    .slice(0, maxItems)

  // Add home item if requested and not already present
  const finalItems = showHome && filteredItems.length > 0 && filteredItems[0].href !== '/home'
    ? [{ label: 'Inicio', href: '/home', icon: 'tabler-home' }, ...filteredItems]
    : filteredItems

  // Don't render if no items or only home
  if (finalItems.length <= 1 && showHome) {
    return null
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm'
      case 'large':
        return 'text-lg'
      default:
        return 'text-base'
    }
  }

  return (
    <Box className={`flex items-center ${className}`}>
      <Breadcrumbs
        separator={
          <Typography className="text-gray-400 mx-1">
            {separator}
          </Typography>
        }
        maxItems={maxItems}
        className={getSizeClasses()}
      >
        {finalItems.map((item, index) => {
          const isLast = index === finalItems.length - 1
          const isClickable = !isLast && item.href

          if (isLast) {
            // Last item - current page (non-clickable)
            return (
              <Box key={index} className="flex items-center gap-2">
                {item.icon && (
                  <i className={`${item.icon} text-current`} />
                )}
                <Typography
                  variant="body2"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  {item.label}
                </Typography>
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    variant="outlined"
                    className="ml-2"
                  />
                )}
              </Box>
            )
          }

          if (isClickable) {
            // Clickable breadcrumb item
            return (
              <Link
                key={index}
                href={item.href || ''}
                className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors duration-200 no-underline"
              >
                {item.icon && (
                  <i className={`${item.icon} text-current`} />
                )}
                <Typography
                  variant="body2"
                  className="text-gray-500 hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Typography>
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    variant="outlined"
                    className="ml-2"
                  />
                )}
              </Link>
            )
          }

          // Non-clickable breadcrumb item
          return (
            <Box key={index} className="flex items-center gap-2">
              {item.icon && (
                <i className={`${item.icon} text-gray-400`} />
              )}
              <Typography
                variant="body2"
                className="text-gray-500 dark:text-gray-400"
              >
                {item.label}
              </Typography>
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  variant="outlined"
                  className="ml-2"
                />
              )}
            </Box>
          )
        })}
      </Breadcrumbs>
    </Box>
  )
}

export default Breadcrumb
