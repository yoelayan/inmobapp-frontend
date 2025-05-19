import React from 'react'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

interface BooleanSlotProps {
  value: string | boolean
}

const BooleanSlot: React.FC<BooleanSlotProps> = ({ value }) => {
  // Convert string 'True'/'False' to boolean if needed
  const boolValue = typeof value === 'string' ? value.toLowerCase() === 'true' : Boolean(value)

  return boolValue ? (
    <CheckCircleIcon color='success' fontSize='small' />
  ) : (
    <CancelIcon color='error' fontSize='small' />
  )
}

export default BooleanSlot
