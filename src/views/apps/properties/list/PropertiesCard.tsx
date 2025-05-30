'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

import HorizontalWithBorder from '@/components/card-statistics/HorizontalWithBorder'

// Hooks
import useProperties from '@/hooks/api/realstate/useProperties'

type DataType = {
  title: string
  stats: string
  avatarIcon: string
  key: string
}

const statusMapping: Record<string, string> = {
  active: 'active',
  'in-approval': 'in_approval',
  paused: 'paused',
  'pre-captured': 'pre_captured',
  inactive: 'inactive',
  private: 'private',
  reserved: 'reserved',
  sold: 'sold',
  hook: 'hook'
}

const data: DataType[] = [
  {
    title: 'Activa',
    stats: '0',
    avatarIcon: 'tabler-check',
    key: 'active'
  },
  {
    title: 'En Aprobación',
    stats: '0',
    avatarIcon: 'tabler-hourglass',
    key: 'in-approval'
  },
  {
    title: 'Pausada',
    stats: '0',
    avatarIcon: 'tabler-pause',
    key: 'paused'
  },
  {
    title: 'Pre-capturada',
    stats: '0',
    avatarIcon: 'tabler-search',
    key: 'pre-captured'
  },
  {
    title: 'Inactiva',
    stats: '0',
    avatarIcon: 'tabler-x',
    key: 'inactive'
  },
  {
    title: 'Privada',
    stats: '0',
    avatarIcon: 'tabler-lock',
    key: 'private'
  },
  {
    title: 'Reservada',
    stats: '0',
    avatarIcon: 'tabler-bookmark',
    key: 'reserved'
  },
  {
    title: 'Vendida',
    stats: '0',
    avatarIcon: 'tabler-shopping-cart',
    key: 'sold'
  },
  {
    title: 'Enganche',
    stats: '0',
    avatarIcon: 'tabler-anchor',
    key: 'hook'
  }
]

interface PropertiesCardProps {
  onStatusChange: (status: string) => void
}

const PropertiesCard = ({ onStatusChange }: PropertiesCardProps) => {
  const [cardActive, setCardActive] = useState('active')
  const [cardsData, setCardsData] = useState<DataType[]>(data)
  const { getTotalProperties } = useProperties()

  useEffect(() => {
    fetchTotalProperties()
  }, [])

  const fetchTotalProperties = async () => {
    try {
      const response = await getTotalProperties()

      if (response && response.results && response.results.status_counts) {
        const statusCounts = response.results.status_counts

        const updatedData = cardsData.map(card => {
          const statusKey = statusMapping[card.key]

          return {
            ...card,
            stats: statusCounts[statusKey as keyof typeof statusCounts]?.toString() || '0'
          }
        })

        setCardsData(updatedData)
      }
    } catch (error) {
      console.error('Error fetching total properties', error)
    }
  }

  const handleChangeCard = (key: string) => {
    setCardActive(key)

    // Map the card key to the status filter format expected by the API
    const statusFilter = statusMapping[key]

    // Call the parent component's handler with the appropriate status filter
    onStatusChange(statusFilter)
  }

  return (
    <Grid container spacing={6}>
      {cardsData.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <HorizontalWithBorder
            {...item}
            onClick={() => handleChangeCard(item.key)}
            key={index}
            isActive={cardActive === item.key}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default PropertiesCard
