import type { IFranchise } from './FranquiciaTypes'

export interface IUserPermission {
  id?: number
  name: string
  codename: string
  description?: string
}

export interface IUserGroup {
  id?: number
  name: string
  permissions: IUserPermission[]
}

export interface IUser {
  id: number
  name: string
  email: string
  image?: string | null
  username?: string
  date_joined?: string
  last_login?: string
  groups?: IUserGroup[]
  group_names?: string[]
  user_permissions?: IUserPermission[]
  franchise?: IFranchise
}

export interface IUserFormData {
  name: string
  email: string
  password?: string
  password_confirm?: string
  franchise?: number
  role?: number[]
  permissions?: string[]
}
