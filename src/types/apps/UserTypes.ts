export interface IUser {
  id: number
  name: string
  email: string
  image?: string | null
  username?: string
  is_active?: boolean
  is_staff?: boolean
  is_superuser?: boolean
  date_joined?: string
  last_login?: string
  groups?: number[]
  group_names?: string[]
  user_permissions?: number[]
}

export interface IUserFormData {
  name: string
  email: string
  password?: string
  password_confirm?: string
  image?: File | null
  is_active?: boolean
  is_staff?: boolean
  is_superuser?: boolean
  groups?: number[]
}
