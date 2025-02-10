'use client'

// MUI Imports
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import type { CardProps } from '@mui/material/Card'

// Third-party Imports
import classnames from 'classnames'

// Types Imports
import type { ThemeColor } from '@core/types'
import type { CardStatsHorizontalWithBorderProps } from '@/types/pages/widgetTypes'


type Props = CardProps & {
  color: ThemeColor
}

const Card = styled(MuiCard)<Props>(({ color }) => ({
  transition: 'border 0.3s ease-in-out, box-shadow 0.3s ease-in-out, margin 0.3s ease-in-out',
  borderBottomWidth: '2px',
  borderBottomColor: `var(--mui-palette-${color}-darkerOpacity)`,
  '[data-skin="bordered"] &:hover': {
    boxShadow: 'none'
  },
  '&:hover': {
    borderBottomWidth: '3px',
    borderBottomColor: `var(--mui-palette-${color}-main) !important`,
    boxShadow: 'var(--mui-customShadows-lg)',
    marginBlockEnd: '-1px'
  },
  '&.active': {
    backgroundColor: `var(--mui-palette-${color}-main)`,
    marginBlockEnd: '-1px'
  },
}))

const HorizontalWithBorder = (props: CardStatsHorizontalWithBorderProps) => {
  // Props
  const {
    title,
    stats,
    trendNumber,
    avatarIcon,
    color,
    comparison,
    isActive,
    onClick
  } = props

  

  return (
    <Card
      onClick={onClick}
      color={color || 'primary'}
      className={classnames(
        { 'cursor-pointer': onClick, 'active': isActive },
      )}
    >
      <CardContent className='flex flex-col gap-1'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-1'>
              <Typography>{title}</Typography>
              <Typography variant='h4'>{stats}</Typography>
            </div>
            
            <i className={classnames(avatarIcon, 'text-[28px]')} />
          </div>
          {trendNumber && (
            <div className='flex items-center gap-2'>
              {comparison && <Typography>{`${comparison}`}</Typography>}
              <Chip
                variant='tonal'
                label={`${trendNumber}%`}
                size='small'
                color={trendNumber > 0 ? 'success' : 'error'}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default HorizontalWithBorder
