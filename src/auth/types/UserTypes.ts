
export type User = {
  image: string
  email: string
  url: string
  name: string
}

export type Session = {
  user: User
  access: string
  refresh: string
  expires_in: number
}
