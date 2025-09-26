// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

type VerticalNavItem = {
  type: 'item' | 'subMenu'
  title?: string
  icon?: JSX.Element
  href?: string
  label?: string
  subMenu?: VerticalNavItem[]
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Items: Dashboard, Propiedades[All, Add],
  const verticalNavItems: VerticalNavItem[] = [
    {
      type: 'item',
      title: 'Dashboard',
      icon: <i className='tabler-home' />,
      href: '/'
    },
    {
      type: 'subMenu',
      label: 'Propiedades',
      icon: <i className='tabler-building' />,
      subMenu: [
        {
          type: 'item',
          title: 'Todas',
          href: '/propiedades'
        },
        {
          type: 'item',
          title: 'Agregar',
          href: '/propiedades/agregar'
        }
      ]
    },
    {
      type: 'subMenu',
      label: 'Clientes',
      icon: <i className='tabler-users' />,
      subMenu: [
        {
          type: 'item',
          title: 'Todos',
          href: '/clientes'
        },
        {
          type: 'item',
          title: 'Agregar',
          href: '/clientes/agregar'
        },
      ]
    },
    {
      type: 'subMenu',
      label: 'Búsquedas',
      icon: <i className='tabler-search' />,
      subMenu: [
        {
          type: 'item',
          title: 'Todas',
          href: '/clientes/busquedas'
        },
        {
          type: 'item',
          title: 'Agregar',
          href: '/clientes/busquedas/agregar'
        }
      ]
    },

    {
      type: 'subMenu',
      label: 'Franquicias',
      icon: <i className='tabler-building' />,
      subMenu: [
        {
          type: 'item',
          title: 'Todas',
          href: '/franquicias'
        },
        {
          type: 'item',
          title: 'Agregar',
          href: '/franquicias/agregar'
        }
      ]
    },
    {
      type: 'subMenu',
      label: 'Usuarios',
      icon: <i className='tabler-users' />,
      subMenu: [
        {
          type: 'item',
          title: 'Todos',
          href: '/usuarios'
        },
        {
          type: 'item',
          title: 'Roles',
          href: '/roles'
        },
        {
          type: 'item',
          title: 'Agregar Usuario',
          href: '/usuarios/agregar'
        }
      ]
    }
  ]

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {verticalNavItems.map((item, index) => {
          if (item.type === 'item') {
            return (
              <MenuItem key={index} title={item.title} icon={item.icon} href={item.href}>
                {item.title}
              </MenuItem>
            )
          }

          if (item.type === 'subMenu') {

            return (
              <SubMenu key={index} label={item.label} icon={item.icon}>
                {item.subMenu?.map((subMenuItem, subMenuIndex) => (
                  subMenuItem.subMenu ? (
                    <SubMenu key={subMenuIndex} label={subMenuItem.label || subMenuItem.title} icon={subMenuItem.icon}>
                      {subMenuItem.subMenu.map((nestedItem, nestedIndex) => (
                        <MenuItem key={nestedIndex} title={nestedItem.title} href={nestedItem.href}>
                          {nestedItem.title}
                        </MenuItem>
                      ))}
                    </SubMenu>
                  ) : (
                    <MenuItem key={subMenuIndex} title={subMenuItem.title} href={subMenuItem.href}>
                      {subMenuItem.title}
                    </MenuItem>
                  )
                ))}
              </SubMenu>
            )
          }

          return null
        })}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
