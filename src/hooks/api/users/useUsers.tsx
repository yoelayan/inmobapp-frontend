import UsersRepository from '@/services/repositories/users/UsersRepository'
import useBaseHookApi from '@/hooks/api/useBaseHookApi'
import type { FilterItem } from '@/types/api/response'

export default function useUsers(defaultFilters?: FilterItem[]) {
  const { fetchData, refreshData, getData, fetchItemById, createData, updateData, deleteData, data, loading, error, errors, item } =
    useBaseHookApi(UsersRepository, defaultFilters)

  const getUsersByFranchise = async (franchiseId: number) => {
    return await UsersRepository.getUsersByFranchise(franchiseId)
  }

  const getGroups = async () => {
    return await UsersRepository.getGroups()
  }


  return {
    fetchData,
    refreshData,
    getData,
    getUsersByFranchise,
    getGroups,
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
