import RolesRepository from '@/services/repositories/roles/RolesRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response.ts'

export default function useRoles(defaultFilters?: FilterItem[]) {
  const { fetchData, refreshData, getData, data, loading, error, errors, item } =
    useBaseHookApi(RolesRepository, defaultFilters)

  return {
    fetchData,
    refreshData,
    getData,
    data,
    loading,
    error,
    errors,
    item,
  }
}
