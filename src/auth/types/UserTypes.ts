export type IProfile = {
  image: string
  email: string
  url: string
  name: string
  franchise: number
  id: number
  user_permissions: string[]
  is_superuser: boolean
}

export type Session = {
  access: string
  refresh: string
  expires_in: number
  user: IProfile
  company: string
}
