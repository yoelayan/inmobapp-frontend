
export interface IFranchiseUser {
  id: number
  name: string
  email: string
}

export interface IFranchise {
  id: number | undefined
  name: string
  identifier?: string
  franchise_type: 'COMMERCIAL' | 'PERSONAL' | 'MASTER'
  group?: number
  parent?: IFranchise | undefined
  children?: IFranchise[]
  users?: IFranchiseUser[]
  users_count?: number
}
