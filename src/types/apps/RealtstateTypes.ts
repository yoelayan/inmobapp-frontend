
import { IFranchise } from '@/types/apps/FranquiciaTypes'
import { IUser } from '@/types/apps/UserTypes'
import { IGeoItem } from '@/types/apps/LocationsTypes'


export interface IRealProperty {
  id: number;
  created_by?: IUser;
  updated_by?: IUser;
  assigned_to?: IUser;
  created_at?: string;
  updated_at?: string;
  status: string;
  name: string;
  description: string;
  characteristics: ICharacteristic[];
  code: string;
  price: string;
  initial_price: string;
  rent_price: string;
  images: IImage[];
  first_image_url: string;
  type_negotiation: IType;
  type_property: IType;
  state: IGeoItem;
  city: IGeoItem;
  franchise?: IFranchise;
}

export interface IType {
  id: number;
  name: string;
}

interface IImage {
  id: number;
  image: string;
  order: number;
}

interface ICharacteristic {
  value: boolean | number | string;
  characteristic: string;
}