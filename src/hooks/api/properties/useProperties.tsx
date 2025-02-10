import PropertiesRepository from '@/repositories/properties/PropertiesRepository'
import useBaseHookApi from '@hooks/useBaseHookApi'
import type { Propiedad } from '@/types/apps/PropiedadesTypes'

export default function useProperties(defaultFilters?: Record<string, any>) {
    return useBaseHookApi<Propiedad>(PropertiesRepository, defaultFilters)
}
