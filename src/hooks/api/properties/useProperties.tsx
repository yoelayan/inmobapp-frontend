import PropertiesRepository from '@/repositories/properties/PropertiesRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { Property } from '@/types/apps/RealtstateTypes'

export default function useProperties(defaultFilters?: Record<string, any>) {
    return useBaseHookApi<Property>(PropertiesRepository, defaultFilters)
}
