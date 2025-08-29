export type Permission = {
  codename: string
  name: string
}

export type GroupPermission = {
  name: string
  codename: string
  permissions: Permission[]
}


export const permissions: GroupPermission[] = [
  {
    name: 'Roles',
    codename: 'roles',
    permissions: [
      {
        codename: 'add_role',
        name: 'Agregar rol',
      },
      {
        codename: 'change_role',
        name: 'Cambiar rol',
      },
      {
        codename: 'delete_role',
        name: 'Eliminar rol',
      },
      {
        codename: 'view_role',
        name: 'Ver rol',
      },
    ]
  },
  {
    name: 'Usuarios',
    codename: 'users',
    permissions: [
      {
        codename: 'add_user',
        name: 'Agregar usuario',
      },
      {
        codename: 'change_user',
        name: 'Cambiar usuario',
      },
      {
        codename: 'delete_user',
        name: 'Eliminar usuario',
      },
      {
        codename: 'view_user',
        name: 'Ver usuario',
      },
    ]
  },
  {
    name: 'Clientes',
    codename: 'clients',
    permissions: [
      {
        codename: 'add_client',
        name: 'Agregar cliente',
      },
      {
        codename: 'change_client',
        name: 'Cambiar cliente',
      },
      {
        codename: 'delete_client',
        name: 'Eliminar cliente',
      },
      {
        codename: 'view_client',
        name: 'Ver cliente',
      },
    ]
  },
  {
    name: 'Observaciones',
    codename: 'observations',
    permissions: [
      {
        codename: 'add_observation',
        name: 'Agregar observación',
      },
      {
        codename: 'view_observation',
        name: 'Ver observación',
      },
      {
        codename: 'change_observation',
        name: 'Cambiar observación',
      },
      {
        codename: 'delete_observation',
        name: 'Eliminar observación',
      },
    ]
  },
  {
    name: 'Búsquedas',
    codename: 'searches',
    permissions: [
      {
        codename: 'add_search',
        name: 'Agregar búsqueda',
      },
      {
        codename: 'change_search',
        name: 'Cambiar búsqueda',
      },
      {
        codename: 'delete_search',
        name: 'Eliminar búsqueda',
      },
      {
        codename: 'view_search',
        name: 'Ver búsqueda',
      },
    ]
  },
  {
    name: 'Características de búsqueda',
    codename: 'search_characteristics',
    permissions: [
      {
        codename: 'add_searchcharacteristic',
        name: 'Agregar característica de búsqueda',
      },
      {
        codename: 'change_searchcharacteristic',
        name: 'Cambiar característica de búsqueda',
      },
      {
        codename: 'delete_searchcharacteristic',
        name: 'Eliminar característica de búsqueda',
      },
      {
        codename: 'view_searchcharacteristic',
        name: 'Ver característica de búsqueda',
      },
    ]
  },
  {
    name: 'Visitas',
    codename: 'visits',
    permissions: [
      {
        codename: 'add_visit',
        name: 'Agregar visita',
      },
      {
        codename: 'change_visit',
        name: 'Cambiar visita',
      },
      {
        codename: 'delete_visit',
        name: 'Eliminar visita',
      },
      {
        codename: 'view_visit',
        name: 'Ver visita',
      },
    ]
  },
  {
    name: 'Características',
    codename: 'characteristics',
    permissions: [
      {
        codename: 'add_characteristic',
        name: 'Agregar característica',
      },
      {
        codename: 'change_characteristic',
        name: 'Cambiar característica',
      },
      {
        codename: 'delete_characteristic',
        name: 'Eliminar característica',
      },
      {
        codename: 'view_characteristic',
        name: 'Ver característica',
      },
    ]
  },

  {
    name: 'Propiedades',
    codename: 'properties',
    permissions: [
      {
        codename: 'add_realproperty',
        name: 'Agregar propiedad',
      },
      {
        codename: 'change_realproperty',
        name: 'Cambiar propiedad',
      },
      {
        codename: 'delete_realproperty',
        name: 'Eliminar propiedad',
      },
      {
        codename: 'view_realproperty',
        name: 'Ver propiedad',
      },
    ]
  },
  {
    name: 'Franquicias',
    codename: 'franchises',
    permissions: [
      {
        codename: 'add_franchise',
        name: 'Agregar franquicia',
      },
      {
        codename: 'change_franchise',
        name: 'Cambiar franquicia',
      },
      {
        codename: 'delete_franchise',
        name: 'Eliminar franquicia',
      },
      {
        codename: 'view_franchise',
        name: 'Ver franquicia',
      },
    ]
  },
  {
    name: 'Características de propiedad',
    codename: 'property_characteristics',
    permissions: [
      {
        codename: 'add_propertycharacteristic',
        name: 'Agregar característica de propiedad',
      },
      {
        codename: 'change_propertycharacteristic',
        name: 'Cambiar característica de propiedad',
      },
      {
        codename: 'delete_propertycharacteristic',
        name: 'Eliminar característica de propiedad',
      },
      {
        codename: 'view_propertycharacteristic',
        name: 'Ver característica de propiedad',
      },
    ]
  },
  {
    name: 'Reservas',
    codename: 'reservations',
    permissions: [
      {
        codename: 'add_reserve',
        name: 'Agregar reserva',
      },
      {
        codename: 'change_reserve',
        name: 'Cambiar reserva',
      },
      {
        codename: 'delete_reserve',
        name: 'Eliminar reserva',
      },
      {
        codename: 'view_reserve',
        name: 'Ver reserva',
      },
    ]
  },
  {
    name: 'Detalles de reserva',
    codename: 'reservation_details',
    permissions: [
      {
        codename: 'add_reservedetail',
        name: 'Agregar detalle de reserva',
      },
      {
        codename: 'change_reservedetail',
        name: 'Cambiar detalle de reserva',
      },
      {
        codename: 'delete_reservedetail',
        name: 'Eliminar detalle de reserva',
      },
      {
        codename: 'view_reservedetail',
        name: 'Ver detalle de reserva',
      },
    ]
  }
]

export const hasPermission = (codename: string) => {
  const permission = permissions.find(permission => permission.permissions.some(p => p.codename === codename))

  return permission ? true : false
}

export const rawPermissions = permissions.map(permission => permission.permissions.map(p => p.codename))

export const getPermission = (codename: string) => {
  const permission = permissions.find(permission => permission.permissions.some(p => p.codename === codename))

  return permission ? permission : null
}
