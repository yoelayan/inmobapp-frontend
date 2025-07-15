'use client'

// React Imports
import React from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'

// Component Imports
import Breadcrumb from './Breadcrumb'
import type { BreadcrumbItem } from './utils'

interface BreadcrumbWrapperProps {

  /**
   * Override the auto-generated breadcrumb items
   */

  customItems?: BreadcrumbItem[]

  /**
   * Show home icon at the beginning
   */

  showHome?: boolean

  /**
   * Show as a paper/card container
   */

  showContainer?: boolean

  /**
   * Show divider below breadcrumb
   */

  showDivider?: boolean

  /**
   * Container padding
   */
  padding?: string | number

  /**
   * Margin bottom
   */
  marginBottom?: string | number

  /**
   * Additional class names
   */
  className?: string

  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * Elevation for paper container
   */
  elevation?: number
}

const BreadcrumbWrapper: React.FC<BreadcrumbWrapperProps> = ({
  customItems,
  showHome = true,
  showContainer = false,
  showDivider = true,
  padding = 16,
  className = '',
  size = 'medium',
  elevation = 0
}) => {
  const breadcrumbElement = (
    <Breadcrumb
      customItems={customItems}
      showHome={showHome}
      size={size}
      className={className}
    />
  )

  if (showContainer) {
    return (
      <Box>
        <Paper
          elevation={elevation}
          sx={{
            padding,
            backgroundColor: 'background.paper',
            borderRadius: 1
          }}
        >
          {breadcrumbElement}
          {showDivider && (
            <Divider sx={{ marginTop: 2 }} />
          )}
        </Paper>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ padding: typeof padding === 'number' ? `${padding}px 0` : padding }}>
        {breadcrumbElement}
      </Box>
      {showDivider && (
        <Divider sx={{ marginTop: 1 }} />
      )}
    </Box>
  )
}

export default BreadcrumbWrapper
