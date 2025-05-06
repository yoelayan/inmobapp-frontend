'use client'

// React Imports
import React, { useState } from 'react'


// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import HorizontalWithBorder from '@/components/card-statistics/HorizontalWithBorder'

type DataType = {
    title: string
    stats: string
    avatarIcon: string
    key: string
}

const data: DataType[] = [
    {
        title: 'Activa',
        stats: '1',
        avatarIcon: 'tabler-check',
        key: 'active'
    },
    {
        title: 'En Aprobación',
        stats: '2',
        avatarIcon: 'tabler-hourglass',
        key: 'in-approval'
    },
    {
        title: 'Pausada',
        stats: '3',
        avatarIcon: 'tabler-pause',
        key: 'paused'
    },
    {
        title: 'Pre-capturada',
        stats: '4',
        avatarIcon: 'tabler-search',
        key: 'pre-captured'
    },
    {
        title: 'Inactiva',
        stats: '5',
        avatarIcon: 'tabler-x',
        key: 'inactive'
    },
    {
        title: 'Privada',
        stats: '6',
        avatarIcon: 'tabler-lock',
        key: 'private'
    },
    {
        title: 'Reservada',
        stats: '7',
        avatarIcon: 'tabler-bookmark',
        key: 'reserved'
    },
    {
        title: 'Vendida',
        stats: '8',
        avatarIcon: 'tabler-shopping-cart',
        key: 'sold'
    },
    {
        title: 'Enganche',
        stats: '9',
        avatarIcon: 'tabler-anchor',
        key: 'hook'
    }
]

const ProductCard = () => {
    const [cardActive, setCardActive] = useState('active')

    const handleChangeCard = (key: string) => {
        console.log(key)
        setCardActive(key)
    }
    

    return (
        
        <Grid container spacing={6}>
            {data.map((item, index) => (
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

export default ProductCard
