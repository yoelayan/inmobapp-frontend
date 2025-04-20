
import type { Status } from './CatalogTypes'
import type { IFranchise } from './FranquiciaTypes'


export interface IClient {
  id: number
  name: string
  email?: string
  phone?: string
  status?: Status
  franchise?: IFranchise


}
