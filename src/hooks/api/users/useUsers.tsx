import UsersRepository from '@/services/repositories/users/UsersRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response.ts'

export default function useUsers(defaultFilters?: FilterItem[]) {
  const { fetchData, refreshData, getData, fetchItemById, createData, updateData, deleteData, data, loading, error, errors, item } =
    useBaseHookApi(UsersRepository, defaultFilters)

  const getUsersByFranchise = async (franchiseId: number) => {
    return await UsersRepository.getUsersByFranchise(franchiseId)
  }


  return {
    fetchData,
    refreshData,
    getData,
    getUsersByFranchise,
    data,
    loading,
    error,
    errors,
    item,
    fetchItemById,
    createData,
    updateData,
    deleteData,
  }
}
