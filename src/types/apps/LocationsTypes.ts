export interface IGeoItem {
  id: number
  name: string
  code: string
}

export interface IState extends IGeoItem {
  // State no tiene relaciones adicionales
}

export interface IMunicipality extends IGeoItem {
  state: IState
}

export interface IParish extends IGeoItem {
  municipality: IMunicipality
}
