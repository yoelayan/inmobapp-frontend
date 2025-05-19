// MUI Imports
import React, { Component } from 'react'

import { useTheme } from '@mui/material/styles'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import HorizontalNav, { Menu, MenuItem } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalMenuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  level?: number
}

type RenderVerticalExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='tabler-chevron-right' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

class HorizontalMenu extends Component {
  buildMenuItems = () => {
    return [
      {
        title: 'Dashboard',
        icon: <i className='tabler-smart-home' />,
        href: '/'
      },
      {
        title: 'About',
        icon: <i className='tabler-info-circle' />,
        href: '/about'
      }
    ]
  }

  render() {
    // Hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const verticalNavOptions = useVerticalNav()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const theme = useTheme()

    // Vars
    const { transitionDuration } = verticalNavOptions

    return (
      <HorizontalNav
        switchToVertical
        verticalNavContent={VerticalNavContent}
        verticalNavProps={{
          customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
          backgroundColor: 'var(--mui-palette-background-paper)'
        }}
      >
        <Menu
          rootStyles={menuRootStyles(theme)}
          renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
          menuItemStyles={menuItemStyles(theme, 'tabler-circle')}
          renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
          popoutMenuOffset={{
            mainAxis: ({ level }) => (level && level > 0 ? 14 : 12),
            alignmentAxis: 0
          }}
          verticalMenuProps={{
            menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
            renderExpandIcon: ({ open }) => (
              <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
            ),
            renderExpandedMenuItemIcon: { icon: <i className='tabler-circle text-xs' /> },
            menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
          }}
        >
          {this.buildMenuItems().map((item, index) => (
            <MenuItem key={index} title={item.title} icon={item.icon} href={item.href} />
          ))}
        </Menu>
      </HorizontalNav>
    )
  }
}

export default HorizontalMenu
