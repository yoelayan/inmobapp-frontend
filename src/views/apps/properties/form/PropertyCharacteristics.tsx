interface PropertyCharacteristicsProps {
  propertyId?: string
  control: Control<any>
  characteristics?: any[] // Accept any type of characteristic data
  onChange?: (characteristics: PropertyCharacteristic[]) => void
}
