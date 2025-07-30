// components/forms/containers/PageContainer.tsx
import React from 'react'

import { Card, CardContent, CardHeader, CircularProgress } from '@mui/material'

import type { FormContainerProps } from '@/types/common/forms.types'

export const PageContainer = ({ title, subtitle, children, loading }: FormContainerProps) => {
  return (
    <Card>
      {title && <CardHeader title={title} subheader={subtitle} />}
      <CardContent>
        {loading ? <CircularProgress /> : children}
      </CardContent>
    </Card>
  )
}
