// composables/useRoleService.js
import { useHttp } from '~/services/httpClient'
import { RoleService } from '~/services/roleService'

export const useRoleService = () => {
  const { client } = useHttp()
  return new RoleService(client)
}