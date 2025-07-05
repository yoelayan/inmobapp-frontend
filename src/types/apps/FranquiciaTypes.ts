export interface IFranchise {
  id: number
  identifier?: string
  name: string
  franchise_type: 'COMMERCIAL' | 'PERSONAL'
  group?: number
  parent?: number
  parent_name?: string
  children?: IFranchise[]
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface IFranchiseFormData {
  identifier?: string
  name: string
  franchise_type: 'COMMERCIAL' | 'PERSONAL'
  group?: number
  parent?: number
}
