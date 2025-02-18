import PropertiesRepository from '@/api/repositories/realstate/PropertiesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'

export default function useProperties(defaultFilters?: Record<string, any>) {
    return useBaseHookApi(PropertiesRepository, defaultFilters)
}
