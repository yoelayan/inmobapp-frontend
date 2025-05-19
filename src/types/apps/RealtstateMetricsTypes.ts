export interface PropertyMetricsResponse {
  results: {
    summary: {
      total_properties: number
      total_properties_in_range: number
      total_sell_properties: number
      total_rent_properties: number
      total_sell_properties_in_range: number
      total_rent_properties_in_range: number
      total_sell_benefit: number
      total_rent_benefit: number
      avg_sell_price: number
      avg_rent_price: number
    }
    monthly_data: {
      [key: string]: {
        total_count: number
        sell_count: number
        rent_count: number
        sell_data: {
          count: number
          total_price: number
          avg_price: number
          benefit: number
        }
        rent_data: {
          count: number
          total_price: number
          avg_price: number
          benefit: number
        }
      }
    }
  }
}

export interface PropertyMetricsFilters {
  date_start?: string
  date_end?: string
}
