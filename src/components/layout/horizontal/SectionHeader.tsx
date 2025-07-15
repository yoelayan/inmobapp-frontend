// React Imports
import React from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'

interface SectionHeaderProps {
  title: string
  subtitle: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          {title}
        </Typography>
        <Typography>{subtitle}</Typography>
      </div>

    </div>
  )
}

export default SectionHeader
