import { RealProperty } from '@/types/apps/RealtstateTypes'

interface IManager {
  // Los metodos definidos en esta interface es para manejar el modelo de negocio sin
  // importar la fuente de datos (API, Base de datos, etc). Incluye validadores,
  // transformadores, representaciones, cambios de estado, etc.
  // para crear un manager, se debe proporcionar un json con el objeto a manejar
}

class RealPropertyManager implements IManager {
  constructor(public data: RealProperty) {
    this.data = data
  }

  public addImage(image: string): void {
    this.data.images.push({ index: this.data.images.length + 1, image: image })
  }
  public removeImage(index: number): void {
    this.data.images = this.data.images.filter(img => img.index !== index)
  }
  public updateImage(index: number, image: string): void {
    this.data.images = this.data.images.map(img => (img.index === index ? { index, image } : img))
  }
  public addCharacteristic(characteristic: number, value: string): void {
    this.data.characteristics.push({
      index: this.data.characteristics.length + 1,
      characteristic: characteristic,
      value: value
    })
  }
  public removeCharacteristic(index: number): void {
    this.data.characteristics = this.data.characteristics.filter(char => char.id !== index)
  }
  public updateCharacteristic(index: number, value: string): void {
    this.data.characteristics = this.data.characteristics.map(char => (char.id === index ? { ...char, value } : char))
  }
}

export default RealPropertyManager
