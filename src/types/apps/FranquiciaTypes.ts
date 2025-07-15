
export interface IFranchise {
  id: number
  name: string
  identifier?: string
  franchise_type: 'COMMERCIAL' | 'PERSONAL'
  group?: number
  parent?: number
  children?: number[] // Por ahora solo un array
}

export interface IFranchiseFormData {
  identifier?: string
  name: string
  franchise_type: 'COMMERCIAL' | 'PERSONAL'
  group?: number
  parent?: number
}
